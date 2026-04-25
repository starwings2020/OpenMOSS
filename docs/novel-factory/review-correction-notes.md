# 复核修正意见记录

> 用途：专门记录“玄机发现问题后，给 Hermes 的修正意见”。
> 角色：
> - 玄机：写修正意见
> - Hermes：读取、执行、回写结果
> - 主人：需要时查看与拍板

---

## 使用规则

1. **玄机发现问题后，先写这里**，不要只在聊天里说。
2. 每条修正意见都要带：
   - 日期时间
   - 对象事项
   - 问题点
   - 建议修正
   - 影响口径
   - 状态
3. Hermes 处理后，要把该条状态改为：
   - `accepted`
   - `rejected`
   - `needs_owner_decision`
4. 如果修正意见已落到正式文档，还要补：
   - 已更新哪些文件
   - 更新时间

---

## 状态定义

- `open`：玄机已提出，Hermes 还未处理
- `accepted`：Hermes 接受并已落盘
- `rejected`：Hermes 判断不采纳，并写清原因
- `needs_owner_decision`：需要主人拍板

---

## 记录模板

```md
## [YYYY-MM-DD HH:MM] <事项标题>
- 提出人：玄机
- 状态：open
- 复核对象：<哪条主线 / 哪份文档 / 哪个结论>

### 发现的问题
- <问题1>
- <问题2>

### 建议修正
- <修正动作1>
- <修正动作2>

### 影响口径
- <哪句话需要改>
- <状态词是否要调整>

### Hermes 处理结果
- 待处理

### 已回写文件
- 待处理
```

---

## [2026-04-25 19:37] 执行规程中的 runtime 审计文件指向过旧
- 提出人：玄机
- 状态：open
- 复核对象：`docs/novel-factory/progress-sync-operating-rules.md`

### 发现的问题
- 执行规程中“runtime 总体验证”仍指向 `docs/novel-factory/openmoss-case-closeout-checklist-audit-20260421.md`。
- 但当前唯一总控板 `docs/novel-factory/current-progress-board.md` 已明确以 `docs/novel-factory/openmoss-case-closeout-checklist-audit-20260425.md` 作为当前主证据。
- 这会导致后续按规程执行的人，仍可能先读到过期审计文件，造成总控板与执行规程之间的证据入口不一致。

### 建议修正
- 将执行规程中的 runtime 审计文件引用，从 `...20260421.md` 更新为 `...20260425.md`。
- 若 20260421 仍需保留，补一行说明：其已被 20260425 审计覆盖，不再作为默认当前口径入口。

### 影响口径
- 需要收紧“统一先看哪些文件”的入口定义，避免复核人与执行人再次从不同审计文件起步。
- 当前总状态词不需要调整，但证据入口需要统一。

### Hermes 处理结果
- 待处理

### 已回写文件
- 待处理

---

## [2026-04-25 23:14] replay-02 通知尾项在总控板与 replay 总表之间口径不一致
- 提出人：玄机
- 状态：open
- 复核对象：`docs/novel-factory/current-progress-board.md` 与 `tmp/novel_factory_replays_20260417/three_replays_summary.json`

### 发现的问题
- 当前总控板已写明：`task_completed / all_done 通知稳定性尾项` 状态为 `completed`，并且明确“不再把 replay-02 那条历史 failed audit 视为当前尾项”。
- 但 `three_replays_summary.json` 中 replay-02 的 `audit_contract.note` 仍写着：`final-assembler 另有 1 条 failed task_completed audit 需单独跟踪`。
- 这会导致读取 replay 总表的人仍把 replay-02 理解为“有未收口尾项”，与总控板当前结论冲突。

### 建议修正
- 将 `three_replays_summary.json` 中 replay-02 的 `audit_contract.note` 改为与总控板一致的表述：历史 failed audit 已完成验证性收口，不再作为当前主线尾项。
- 如需保留历史事实，改写为“存在历史 failed 样本，但已完成后续验证，不再视为当前 blocker / 当前尾项”。

### 影响口径
- 需要统一 replay-02 当前结论，避免一处说“已收口”，另一处仍说“需单独跟踪”。
- 当前状态词不一定要调整，但 replay 总表的备注口径必须收紧。

### Hermes 处理结果
- 待处理

### 已回写文件
- 待处理

---

## [2026-04-25 23:35] 小说工厂运行层证据边界仍需收紧，避免把脚本固化讲成 live 运行收口
- 提出人：玄机
- 状态：open
- 复核对象：`docs/novel-factory/current-progress-board.md`、`docs/novel-factory/standard-task-entry-live-runtime-runbook.md`

### 发现的问题
- 当前总控板已较克制地写明：小说工厂资产层为 `partial`，运行层“统一调度入口仍未收口成稳定自动生产线”。
- 但 runbook 同时写明：`run_standard_task_flow.py` 已把“一键串联”产品化，且标准任务入口/flow 脚本接口已固化。
- 更关键的是，runbook 也明确写了：**本文档还没追加新的 6565 live 端到端复跑证据**；当前能确认的是脚本接口与串联行为已固化，还不能升级成新的 live 主证据。
- 如果后续只摘“脚本已固化 / 一键 flow 已产品化”这些句子，容易把“入口脚本资产已就位”误讲成“运行层已经稳定收口”。

### 建议修正
- 在总控板的小说工厂部分，继续明确区分两层：
  1. 标准任务入口 / flow 脚本已固化（资产层 / 工具层）
  2. 新的一键 live 复跑 closeout 证据尚未形成（运行层 / 实证层）
- 如后续 Hermes 对外汇报小说工厂进度，优先引用“未完成”段落与 runbook 中“尚无新的 live 主证据”这句边界说明。
- 在真正跑出一轮新的 6565 live 端到端复跑前，不要把“可持续重复创建”延伸表述为“可稳定自动生产并已完成 closeout 复验”。

### 影响口径
- 需要避免把“标准任务入口首版已经落地”扩讲成“小说工厂运行层已收口”。
- 当前总状态词未必需要调整，但运行层结论必须继续收紧在“脚本接口已固化，live 端到端复跑证据待补”。

### Hermes 处理结果
- 待处理

### 已回写文件
- 待处理

---

## 当前约定

- 玄机所有正式“补洞 / 口径纠偏 / 修正建议”，统一先写入本文件。
- Hermes 处理修正意见后，再去更新：
  - `docs/novel-factory/current-progress-board.md`
  - 对应证据文件
  - 必要时更新模板或执行规程

---

## [2026-04-26 03:00] 协作消息模板仍保留 replay-01 的旧证据路径，复用时会把汇报口径带回 20260421
- 提出人：玄机
- 状态：open
- 复核对象：`docs/novel-factory/collaboration-message-templates.md`

### 发现的问题
- 协作消息模板中的 Hermes 现成版，仍引用 `docs/novel-factory/replay-online-bridge-20260421-153534/replay-01_bridge_result.json` 与 `.../replay-01_patrol_probe.json`。
- 这类模板本来就是给后续协作直接复制复用的；如果继续保留旧路径，后面一旦直接套用，就会把当前汇报重新锚定到 replay-01 的旧桥接阶段。
- 这不是单纯“历史文档还在”，而是**当前协作模板仍内嵌旧证据入口**，会直接影响后续消息内容。

### 建议修正
- 将模板中的示例证据路径改成不绑定具体旧轮次的占位写法，例如：`docs/novel-factory/replay-online-bridge-<timestamp>/...`。
- 如果要保留示例，改成当前主线更贴近 closeout 的新证据文件，且明确标注“以下为示例，不代表当前默认轮次”。
- 同时检查模板中的“当前结论”示例句，避免继续把 replay-01 写成“还没 closeout”的旧阶段口径。

### 影响口径
- 需要避免协作模板把执行人再次带回旧轮次、旧阶段、旧证据路径。
- 当前总控板状态词不需要调整，但模板中的示例内容必须去旧化，否则后续汇报很容易口径倒退。

### Hermes 处理结果
- 待处理

### 已回写文件
- 待处理

---

## [2026-04-26 04:47] 协作模板中的现成示例结论已落后于当前总控板，需从 replay-01 桥接中改成当前主线口径
- 提出人：玄机
- 状态：open
- 复核对象：`docs/novel-factory/collaboration-message-templates.md` 与 `docs/novel-factory/current-progress-board.md`

### 发现的问题
- 当前总控板已明确：
  - OpenMOSS runtime 本体已 completed
  - replay-01 / replay-02 / replay-03 已全部 live closeout completed
  - 小说工厂运行层已新增 live runner 现场闭环证据，当前剩余问题是“稳定自动生产线”，不是“有没有 live 证据”
- 但协作模板里的“现成可直接用”示例仍写的是：
  - `事项：replay-01 在线桥接收口`
  - `当前状态：in_progress`
  - `replay-01 已完成第一层在线桥接，但还没 closeout`
  - `还缺 workspace 写盘与 task_completed/all_done`
- 这已经不是单纯“历史路径”问题，而是**现成示例结论本身已经落后于当前主线事实**；后续若直接复制，会把当前状态倒退回旧阶段。

### 建议修正
- 将模板里的“现成可直接用三条模板”整体改成不绑定 replay-01 桥接阶段的通用示例，或改成当前主线一致的 closeout / 复核 / 稳定性跟踪示例。
- 至少删除以下旧阶段句子：
  - `replay-01 已完成第一层在线桥接，但还没 closeout`
  - `还缺 workspace 写盘与 task_completed/all_done`
- 若保留具体案例，应改成与当前总控板一致的最新表述，例如“runtime 已 completed，三轮 replay 已 closeout，当前在盯稳定生产线与尾项观察”。

### 影响口径
- 需要避免协作模板继续输出旧阶段判断，把已 closeout 的 replay-01 又说回 bridge 阶段。
- 当前总状态词不需要调整，但模板的现成示例必须更新到当前主线，不然会直接污染后续协作消息。

### Hermes 处理结果
- 待处理

### 已回写文件
- 待处理
