"""
通知服务：后端直发（B 主）+ Agent 侧读取配置自发（A 辅）

当前实现：
- 支持 notification.enabled / channels / events
- 支持 channel 格式：
  - webhook:<url>
  - feishu-webhook:<url>
- 对未知 channel 类型只记日志，不抛异常
- 失败不影响主事务；调用方应在提交后触发
"""
from __future__ import annotations

from datetime import datetime
from typing import Iterable
import httpx

from app.config import config


class NotificationService:
    def _cfg(self) -> dict:
        return config.notification_config or {}

    def is_enabled_for(self, event: str) -> bool:
        cfg = self._cfg()
        if not cfg.get("enabled", False):
            return False
        events = cfg.get("events", []) or []
        return event in events

    async def send_event(self, event: str, title: str, body: str, extra: dict | None = None) -> dict:
        cfg = self._cfg()
        channels = cfg.get("channels", []) or []
        result = {"event": event, "attempted": 0, "sent": 0, "failed": 0, "errors": []}

        if not self.is_enabled_for(event):
            return result

        payload = {
            "event": event,
            "title": title,
            "body": body,
            "extra": extra or {},
            "sent_at": datetime.now().isoformat(),
            "project": config.project_name,
        }

        for channel in channels:
            result["attempted"] += 1
            try:
                if channel.startswith("webhook:"):
                    url = channel[len("webhook:"):]
                    async with httpx.AsyncClient(timeout=10.0) as client:
                        resp = await client.post(url, json=payload)
                        resp.raise_for_status()
                    result["sent"] += 1
                elif channel.startswith("feishu-webhook:"):
                    url = channel[len("feishu-webhook:"):]
                    feishu_payload = {
                        "msg_type": "text",
                        "content": {
                            "text": f"{title}\n\n{body}\n\n事件: {event}\n详情: {payload['extra']}"
                        },
                    }
                    async with httpx.AsyncClient(timeout=10.0) as client:
                        resp = await client.post(url, json=feishu_payload)
                        resp.raise_for_status()
                        data = resp.json()
                        if isinstance(data, dict) and data.get("code", 0) not in (0, None):
                            raise RuntimeError(f"feishu webhook error: {data}")
                    result["sent"] += 1
                else:
                    # B 主先落最小可用通道；未知类型留给 A 辅 / 后续扩展
                    print(f"[Notification] 未实现的渠道类型: {channel}")
                    result["failed"] += 1
                    result["errors"].append(f"unsupported channel: {channel}")
            except Exception as e:
                result["failed"] += 1
                result["errors"].append(f"{channel}: {e}")
                print(f"[Notification] 发送失败 channel={channel} event={event}: {e}")

        print(f"[Notification] 事件={event} attempted={result['attempted']} sent={result['sent']} failed={result['failed']}")
        return result


notification_service = NotificationService()
