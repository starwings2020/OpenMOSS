# 6565 live 标准任务一键 runner 静默复跑证据（20260425-231617）

## 一句话结论

这条一键 runner 已在 **6565 live runtime** 现场跑通静默 closeout：

- 标准任务创建成功
- 13 条 `sub_task` 全部收口到 `done`
- 父 `task` 已 `completed`
- `review_record = 13`
- `reward_log = 13`
- `notification_audit = 0`
- `notification_drain = {"suppressed": true, "waited": false, "pending_jobs": 0}`

所以这部分现在可以明确说：**一键 runner 不只支持“发通知的完整 closeout”，也支持“静默验证式 closeout”。**

---

## 本次运行输入

- base_url: `http://127.0.0.1:6565`
- case_id: `novel-standard-silent-20260425-231617`
- task_name: `单章节小说骨架试跑`
- planner 实例：`子舆`
  - planner_id: `a31d4389-9521-43f9-9556-73fd0e2d9ca6`
- reviewer 实例：`司衡`
  - reviewer_id: `5f1bc34b-84bf-4768-b693-1ced018ba2a7`
- assigned_agents 来源：
  - live `/api/agents` 自动映射（`assigned_agents_source = live_runtime`）
- case payload：
  - `scripts/novel_factory/examples/case_payload.single-chapter.json`
- 模式：
  - `--activate-task`
  - `--suppress-notifications`

> 说明：本次主打的是“静默 closeout 是否能完整收口且不污染通知审计”，所以不再要求出现 `task_completed/all_done(sent)` 样本。

---

## 本次执行命令骨架

```bash
source .venv/bin/activate
RUN_ROOT="$(mktemp -d /tmp/openmoss-silent-flow.XXXXXX)"
CASE_ID="novel-standard-silent-$(date +%Y%m%d-%H%M%S)"
PLANNER_ID="a31d4389-9521-43f9-9556-73fd0e2d9ca6"
REVIEWER_ID="5f1bc34b-84bf-4768-b693-1ced018ba2a7"
export OPENMOSS_PLANNER_API_KEY='<planner_api_key>'

PYTHONPATH=. python3 scripts/novel_factory/run_standard_task_flow.py \
  --workspace-root "$RUN_ROOT" \
  --case-id "$CASE_ID" \
  --case-payload scripts/novel_factory/examples/case_payload.single-chapter.json \
  --planner-id "$PLANNER_ID" \
  --reviewer-id "$REVIEWER_ID" \
  --base-url http://127.0.0.1:6565 \
  --planner-api-key "$OPENMOSS_PLANNER_API_KEY" \
  --activate-task \
  --suppress-notifications
```

---

## 关键输出文件

- flow summary：
  - `/tmp/openmoss-silent-flow.vzGSLb/standard-task-flow.novel-standard-silent-20260425-231617.json`
- entry summary：
  - `/tmp/openmoss-silent-flow.vzGSLb/standard-task-entry.novel-standard-silent-20260425-231617.json`
- closeout workspace：
  - `/tmp/openmoss-silent-flow.vzGSLb/closeout-workspace/novel-standard-silent-20260425-231617_493f4e04`

---

## 现场结果

### runtime task

- runtime_task_id: `493f4e04-1b18-484c-b0ba-6ca18d05dc36`
- task status: `completed`
- sub_task_count: `13`

### closeout 结果

- sub_task status：`done x 13`
- review_count: `13`
- reward_log_count: `13`
- notification_event_count: `0`
- notification_drain:
  - `suppressed: true`
  - `waited: false`
  - `pending_jobs: 0`

这说明这版 runner 在静默模式下，不只是“能创建 task”，而是**已经把 closeout 与审查收口一并带过去，同时不发通知。**

---

## sqlite 复核

按本轮 `task_id = 493f4e04-1b18-484c-b0ba-6ca18d05dc36` 过滤后，可见：

- `task.status = completed`
- `sub_task done = 13`
- `review_record = 13`
- `notification_audit = 0`

所以这次静默验证不是“日志上看起来像没发通知”，而是**数据库审计层也确实没有落通知样本**。

---

## workspace 产物

本轮 closeout workspace 下已写出最小工件集：

- `00_case_input.md`
- `00_style_rules.md`
- `01_plot-architect/01_plot_blueprint.md`
- `02_scene-architect/02_scene_plan.md`
- `03_writer/03_draft.md`
- `04_dialogue-expert/04_dialogue_pass.md`
- `05_emotion-curve-designer/05_emotion_curve.md`
- `06_character-growth/06_character_growth.md`
- `07_psychological-portrayal-expert/07_psychology_pass.md`
- `08_opening-ending-designer/08_opening_ending.md`
- `09_hook-designer/09_hook_design.md`
- `10_reviewer/10_review_report.md`
- `11_revision-polish-expert/11_revision_pass.md`
- `12_style-consistency-checker/12_style_report.md`
- `13_final-assembler/13_final_chapter.md`

---

## 这条证据解决了什么问题

它解决的是一个新问题：

- 之前我们已经证明过“一键 runner 能在 6565 live 上把通知也收尾发出去”
- 但还没证明“同一条 runner 能不能切成静默模式，只做 closeout 验证、不发通知”

现在这句已经可以收口为：

- **runner 已同时具备两种 live 现场路径：**
  1. 正常通知版：`13 task_completed(sent) + 1 all_done(sent)`
  2. 静默验证版：`13 done + review_count=13 + notification_audit=0`

---

## 边界说明

1. 静默模式下，`notification_service` 仍会输出 `background_dispatch_suppressed` 结构化日志。
2. 因此不要把 stdout 重定向文件直接当成纯 JSON 结果文件。
3. 真正应该读取的是脚本落盘的：
   - `standard-task-flow.<slug>.json`
   - `standard-task-entry.<slug>.json`
4. 这条证据最适合回答：
   - 标准任务入口在 6565 live 上能不能做“无副作用 closeout 复验”。

答案是：**能。**
