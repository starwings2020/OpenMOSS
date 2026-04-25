# 标准任务入口 → live runtime 创建顺序（2026-04-25）

> 目标：把已经固化好的标准任务入口，收成一条可重复执行的 live runtime 创建顺序。
>
> 当前入口脚本：`scripts/novel_factory/create_standard_novel_task_entry.py`

---

## 1. 这条入口现在能做什么

标准任务入口现在已经统一收口成一条脚本链：

1. `seed case`
2. 生成 `bone_chain_manifest.json`
3. 生成 `bridge-plan.<case>.json`
4. 如提供 live runtime 配置，则直接创建：
   - 父 `task`
   - 13 条骨架 `sub_task`
5. 输出 `standard-task-entry.<case>.json` 作为最终摘要

也就是说，当前已经不需要再手动拆成：

- 先 seed
- 再 bridge
- 再 create online task

除非你是在排障或对照历史两段式链路。

---

## 2. 输入与输出

### 输入

最小输入只有两类：

1. **case payload**
   - 例如：`scripts/novel_factory/examples/case_payload.single-chapter.json`
2. **runtime 路由信息**
   - 方案 A：显式 `assigned_agents`
   - 方案 B：直接从 live `/api/agents` 自动拉取并映射

### 输出

固定会拿到：

- `bone_chain_manifest.json`
- `bridge-plan.<slug>.json`
- `standard-task-entry.<slug>.json`

如进入 live 创建模式，还会额外拿到：

- `runtime_result.summary.task_id`
- `runtime_result.summary.created_sub_task_count`
- 每条在线 `sub_task` 的创建结果

---

## 3. 推荐执行顺序

## 3.1 先做 plan-only 复验

适合：

- 本地检查入口有没有坏
- 验证 case payload / 输出结构
- 不想直接碰 live DB

```bash
REPO_ROOT=/home/joviji/.openclaw/workspace/openmoss
EXAMPLES_DIR="$REPO_ROOT/scripts/novel_factory/examples"
RUN_ROOT="$(mktemp -d /tmp/openmoss-novel-standard.XXXXXX)"

python3 "$REPO_ROOT/scripts/novel_factory/create_standard_novel_task_entry.py" \
  --workspace-root "$RUN_ROOT" \
  --case-id "novel-standard-plan-only" \
  --case-payload "$EXAMPLES_DIR/case_payload.single-chapter.json" \
  --assigned-agents "$EXAMPLES_DIR/assigned_agents.novel-minimal.json" \
  --task-name "单章节小说骨架试跑 / plan-only"
```

预期结果：

- `summary.mode = plan_only`
- `summary.sub_task_count = 13`
- 生成 manifest / bridge-plan / standard-task-entry 三份文件

---

## 3.2 再做 live runtime 创建

适合：

- 需要直接把标准骨架链打进 6565 live runtime
- 想复用当前 live DB 里已注册的小说角色实例

### 推荐方式：环境变量 + 自动 agent 映射

```bash
REPO_ROOT=/home/joviji/.openclaw/workspace/openmoss
EXAMPLES_DIR="$REPO_ROOT/scripts/novel_factory/examples"
RUN_ROOT="$(mktemp -d /tmp/openmoss-novel-live-standard.XXXXXX)"

export OPENMOSS_BASE_URL="http://127.0.0.1:6565"
export OPENMOSS_PLANNER_API_KEY="<planner-api-key>"

python3 "$REPO_ROOT/scripts/novel_factory/create_standard_novel_task_entry.py" \
  --workspace-root "$RUN_ROOT" \
  --case-id "novel-standard-live" \
  --case-payload "$EXAMPLES_DIR/case_payload.single-chapter.json" \
  --task-name "单章节小说骨架试跑 / live-standard" \
  --activate-task
```

说明：

- 不传 `--assigned-agents` 时，脚本会自动请求 `/api/agents`
- 然后按当前统一注册表，把 13 个岗位映射到 live 已注册 agent
- `OPENMOSS_BASE_URL` 与 `OPENMOSS_PLANNER_API_KEY` 必须成对存在；缺一会直接报错

### 如果你要强制指定实例 ID

```bash
python3 "$REPO_ROOT/scripts/novel_factory/create_standard_novel_task_entry.py" \
  --workspace-root "$RUN_ROOT" \
  --case-id "novel-standard-live-explicit" \
  --case-payload "$EXAMPLES_DIR/case_payload.single-chapter.json" \
  --assigned-agents "$EXAMPLES_DIR/assigned_agents.novel-minimal.json" \
  --task-name "单章节小说骨架试跑 / live-standard-explicit" \
  --base-url "http://127.0.0.1:6565" \
  --planner-api-key "$OPENMOSS_PLANNER_API_KEY" \
  --activate-task
```

---

## 3.3 一键串联创建 + closeout

如果你不想再手动分两段跑，现在可以直接用：

- `scripts/novel_factory/run_standard_task_flow.py`

它会顺序做三件事：

1. 调 `create_standard_novel_task_entry.py` 创建标准任务
2. 取回 `runtime_task_id`
3. 继续调 `closeout_standard_task.py`，并输出 `standard-task-flow.<slug>.json`

最小示例：

```bash
REPO_ROOT=/home/joviji/.openclaw/workspace/openmoss
EXAMPLES_DIR="$REPO_ROOT/scripts/novel_factory/examples"
RUN_ROOT="$(mktemp -d /tmp/openmoss-novel-standard-flow.XXXXXX)"

export OPENMOSS_BASE_URL="http://127.0.0.1:6565"
export OPENMOSS_PLANNER_API_KEY="***"

python3 "$REPO_ROOT/scripts/novel_factory/run_standard_task_flow.py" \
  --workspace-root "$RUN_ROOT" \
  --case-id "novel-standard-live-oneclick" \
  --case-payload "$EXAMPLES_DIR/case_payload.single-chapter.json" \
  --planner-id "<planner_id>" \
  --reviewer-id "<reviewer_id>"
```

默认行为：

- entry / flow summary 写到 `--output-dir` 或 `--workspace-root`
- closeout 写盘目录默认落到 `<output_dir>/closeout-workspace`
- closeout audit 默认查仓库下 `data/tasks.db`
- 如需改成别的路径，可显式传：
  - `--closeout-workspace-root`
  - `--closeout-audit-db-path`

当前已补最小回归：

- `tests/test_standard_task_flow_runner.py`

当前已补 live 现场证据：

- `docs/novel-factory/live-standard-flow-verify-20260425-195221.md`
  - 证明一键 runner 已能在 6565 live 上完成“创建 + closeout + 通知收尾”
  - 结果：`13 task_completed(sent) + 1 all_done(sent)`
- `docs/novel-factory/live-standard-flow-silent-verify-20260425-231617.md`
  - 证明一键 runner 已能在 6565 live 上完成“创建 + closeout + 静默收口”
  - 结果：`13 done + review_count=13 + notification_audit=0`
- 以上 live 样本证明的是一键 runner 已具备现场闭环能力；它们不是“整个小说工厂运行层已收成统一稳定自动生产线”的同义句。

### 3.4 静默 closeout / 静默 one-click

如果你这次只是想：

- 验证 13 岗位骨架链能否完整收口
- 写盘 closeout workspace
- 落 review / reward
- **但不希望真的发出通知 / 不希望污染 `notification_audit`**

现在可以直接加：

- `--suppress-notifications`

两条脚本都支持：

- `scripts/novel_factory/closeout_standard_task.py`
- `scripts/novel_factory/run_standard_task_flow.py`

最小 one-click 静默示例：

```bash
REPO_ROOT=/home/joviji/.openclaw/workspace/openmoss
EXAMPLES_DIR="$REPO_ROOT/scripts/novel_factory/examples"
RUN_ROOT="$(mktemp -d /tmp/openmoss-novel-standard-silent.XXXXXX)"

source "$REPO_ROOT/.venv/bin/activate"
PYTHONPATH="$REPO_ROOT" python3 "$REPO_ROOT/scripts/novel_factory/run_standard_task_flow.py" \
  --workspace-root "$RUN_ROOT" \
  --case-id "novel-standard-silent-$(date +%Y%m%d-%H%M%S)" \
  --case-payload "$EXAMPLES_DIR/case_payload.single-chapter.json" \
  --planner-id "<planner_id>" \
  --reviewer-id "<reviewer_id>" \
  --base-url "http://127.0.0.1:6565" \
  --planner-api-key "$OPENMOSS_PLANNER_API_KEY" \
  --activate-task \
  --suppress-notifications
```

### 3.5 静默模式的验收口径

静默模式通过，不要看 stdout 重定向文件；优先看脚本自己写出的：

- `standard-task-flow.<slug>.json`
- `standard-task-entry.<slug>.json`

至少核这几项：

1. `summary.runtime_task_id` 非空
2. `closeout.task.status == completed`
3. `closeout.sub_task_status_counts.done == 13`
4. `closeout.review_count == 13`
5. `closeout.notification_events == []`
6. `closeout.notification_drain == {"suppressed": true, "waited": false, "pending_jobs": 0}`
7. 若再查 live sqlite：
   - `notification_audit` 对该 `task_id` 的计数应为 `0`

注意：

- 静默模式下 `notification_service` 仍会把 `background_dispatch_suppressed` 结构化日志打到 stdout
- 所以不要把 `> result.json` 当成纯 JSON 结果文件
- 真正的验收文件是脚本落盘的 `standard-task-flow.*.json`
- 宿主机脚本执行时仍需要带：`PYTHONPATH=.` 或 `PYTHONPATH="$REPO_ROOT"`

### 3.6 正常通知版 vs 静默验证版

两种模式都走同一套标准入口 / closeout 脚本；区别只在**是否真的 dispatch notification**，所以验收口径也要跟着切开。

| 项 | 正常通知版 | 静默验证版 |
| --- | --- | --- |
| 入口脚本 | `run_standard_task_flow.py` / `closeout_standard_task.py` | 同一套脚本 |
| 关键开关 | 不传 `--suppress-notifications` | 传 `--suppress-notifications` |
| closeout 结果 | `done + review + reward + dispatch notification` | `done + review + reward`，但不 dispatch notification |
| `closeout.notification_events` | 有事件明细 | `[]` |
| `closeout.notification_drain` | 会等待后台投递收尾 | `{"suppressed": true, "waited": false, "pending_jobs": 0}` |
| `notification_audit` | 会新增该任务对应记录 | 应为 `0` |
| stdout / 日志观感 | 可能看到通知相关结构化日志与投递收尾信息 | 仍可能看到 `background_dispatch_suppressed`，但这不代表通知真的发出 |
| 核心验收重点 | 既要看 `13 done + review/reward`，也要看 `task_completed / all_done` 是否真正落到通知链 | 只看 `13 done + review/reward + workspace closeout`，不要再拿通知链结果当通过条件 |
| 适用场景 | 真正联调通知链路、验收群消息 | 只验骨架链闭环、回归 closeout、避免污染通知面板 |
| 现场证据 | `live-standard-flow-verify-20260425-195221.md` | `live-standard-flow-silent-verify-20260425-231617.md` |

一句话区分：

- **正常通知版**：验“任务闭环 + 通知链路”
- **静默验证版**：验“任务闭环本身”，但不发消息

---

## 4. 当前固定创建顺序

这条标准入口当前固定创建：

1. 父任务 `task`
2. 如指定 `--activate-task`，将父任务状态置为 `active`
3. 按骨架链顺序创建 13 条子任务：
   1. `剧情架构 / plot-architect`
   2. `场景架构 / scene-architect`
   3. `正文初稿 / writer`
   4. `对话优化 / dialogue-expert`
   5. `情绪曲线 / emotion-curve-designer`
   6. `人物成长 / character-growth`
   7. `心理描写 / psychological-portrayal-expert`
   8. `开篇结尾 / opening-ending-designer`
   9. `钩子设计 / hook-designer`
   10. `综合审查 / reviewer`
   11. `修订润色 / revision-polish-expert`
   12. `风格一致性 / style-consistency-checker`
   13. `最终组装 / final-assembler`

每条 `sub_task` 会同时写入：

- `description`
- `deliverable`
- `acceptance`
- `semantic_role`
- `system_role`
- `reviewer_role`
- `review_focus`
- `artifact_path`
- `upstream_inputs`
- `assigned_agent`

---

## 5. 最小验收点

执行完后至少核对这几项：

1. `standard-task-entry.<slug>.json` 存在
2. 若是 plan-only：
   - `summary.mode == plan_only`
3. 若是 live 模式：
   - `summary.mode == runtime_created`
   - `summary.runtime_task_id` 非空
   - `runtime_result.summary.created_sub_task_count == 13`
4. `plan.sub_tasks[0].assigned_agent` 与 `plan.sub_tasks[-1].assigned_agent` 已解析到实际 agent_id
5. `bridge-plan.<slug>.json` 可继续作为对照工件保留

---

## 6. 当前边界

这条入口已经解决的是：

- 标准单章节 case 固化
- 统一注册表到 13 岗位骨架链的映射
- plan-only / live-create 两种模式收口
- 直接复用 live `/api/agents` 自动映射

但它**还不等于**：

- 已经形成稳定 recurring 调度器
- 已经自动完成整轮执行与 closeout
- 已经收成大规模自动生产线

当前它解决的是“标准任务入口”，不是“整轮自动生产线”。

---

## 7. 一句话收口

**现在小说工厂的“标准任务入口 → live runtime 创建顺序”已经明确：先用统一 case seed 出标准骨架，再由标准入口脚本一次性生成 plan，并按需直接打进 6565 live runtime。**
