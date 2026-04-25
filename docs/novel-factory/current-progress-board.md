# OpenMOSS / 小说工厂当前真实进度看板

> 更新时间：2026-04-25 19:55 CST
> 维护原则：此文件作为当前阶段**唯一对外口径板**；若与历史 audit/closeout 文档冲突，以本文件 + 本文引用的最新证据为准。

---

## 一、为什么会出现“你们两个人口径不一致”

### 直接原因

不是完全没共享文件，而是**共享的是一堆分层证据文件，不是单一总控进度板**。

当前仓库里同时存在：

- `docs/novel-factory/openmoss-case-closeout-checklist-audit-20260425.md`
- `docs/novel-factory/openmoss-three-replays-live-gap-audit-20260425.md`
- `docs/novel-factory/replay-online-bridge-20260421-141349/replay-02_closeout_summary.md`
- `docs/novel-factory/replay-online-bridge-20260425-114848/replay-03_closeout_summary.md`
- `docs/novel-factory/live-standard-flow-verify-20260425-195221.md`
- `tmp/novel_factory_replays_20260417/three_replays_summary.json`
- 各 replay 目录下的 `99_audit_summary.md`
- 各桥接目录下的 `*_bridge_result.json` / `*_patrol_probe.json` / `*_closeout_result.json`

这些文件都是真的，但它们关注层级不同：

1. **runtime closeout**
2. **三轮 replay 汇总**
3. **单轮 replay bridge 证据**
4. **单轮 replay artifact frontmatter**
5. **数据库实时状态**

所以如果一个人主要读的是“旧汇总文档”或“某一层 summary”，另一个人读的是“最新 DB + 单轮 closeout 结果”，口径就会错位。

### 当前具体错位点

1. **replay-02 已 completed**，但如果只沿用较早的 gap 叙述，会误以为它还只是 bridge 半成品。
2. **replay-01 已补齐到 live closeout completed**（13 done + workspace 写盘 + delivery/review/reward + task_completed/all_done），但若只读旧文档，仍会误以为它还停在 patrol 半成品阶段。
3. **replay-03 也已在 2026-04-25 补齐到 live closeout completed**，但若只读 4/21 左右的旧看板/审计，仍会误读成未完成桥接。
4. **小说工厂资产层**（role index、task-single-chapter-novel、prompts/agents 小说角色 prompt）与**运行层**（当前 6565 live runtime 上是否稳定自动调度）混在一起说，容易把“已有资产”误讲成“还只有蓝图”。

---

## 二、解决办法（从现在开始的统一口径机制）

### 方案：建立“1 个总控板 + 4 个证据槽位”的更新机制

### A. 唯一总控板

统一以本文件为**唯一进度口径板**：

- `docs/novel-factory/current-progress-board.md`

配套执行规程：

- `docs/novel-factory/progress-sync-operating-rules.md`
- `docs/novel-factory/collaboration-message-templates.md`

以后对外汇报时：

1. 先看本文件
2. 再按需要下钻到证据文件
3. 不再直接拿历史 dated audit 当“当前总状态”

### B. 四个证据槽位固定映射

#### 1. runtime 总体验证
- 文件：`docs/novel-factory/openmoss-case-closeout-checklist-audit-20260425.md`
- 用途：证明 6565 live runtime 本体是否健康、workspace 是否对齐、通知链是否可用

#### 2. 三轮 replay 总表
- 文件：`tmp/novel_factory_replays_20260417/three_replays_summary.json`
- 用途：记录 replay-01/02/03 当前判定（artifact / db / log / webhook / status）

#### 3. 单轮 replay 在线证据
- 目录：`docs/novel-factory/replay-online-bridge-*/`
- 用途：记录某一轮 replay 的桥接 / patrol / closeout 结果

#### 4. 小说工厂资产层
- 关键文件：
  - `feishu-8-agents/ROLE_INDEX.md`
  - `prompts/role/task-single-chapter-novel.md`
  - `prompts/agents/*.md`
- 用途：回答“有没有角色资产 / prompt / 骨架链”

### C. 更新规则

以后每做完一个关键阶段，必须同时更新两处：

1. 更新对应证据文件
2. 更新本 `current-progress-board.md`

### D. 状态词强制收敛

以后只允许四种总状态：

- `completed`
- `in_progress`
- `partial`
- `pending`

不要再混用：

- “差不多完成”
- “基本打通”
- “接近收口”
- “方向清楚”

这类会导致口径漂移的话。

---

## 三、当前真实进度看板

## 1. OpenMOSS live runtime（6565）

### 当前状态
- **completed**

### 已完成
- 6565 live runtime 健康检查通过
- Docker 运行态、配置源、workspace.root 已对齐到 `/workspace`
- planner/reviewer 审查契约在线成立
- `request_log / activity_log / review_record / notification_audit` 已在线复验通过
- `task_completed / all_done / patrol_alert` 通知链已在线实证

### 当前结论
- **OpenMOSS 运行底座本体已收口，不再是主要 blocker**

### 主证据
- `docs/novel-factory/openmoss-case-closeout-checklist-audit-20260425.md`

---

## 2. replay-01 在线桥接

### 当前状态
- **completed**

### 已完成
- live task：`aa418f43-4178-4678-88d2-8360ee8f5803`
- 13 条 sub_task 已全部 `done`
- 父 task 已 `completed`
- live workspace 已有 13 份产物：`/workspace/tasks/novel-case-replay-01-20260421-153534_aa418f43/`
- `review_record = 13`
- `delivery activity_log = 13`
- `reward_log = 13`
- `notification_audit` 已出现 **13 条 `task_completed(sent)` + 1 条 `all_done(sent)`**
- 早先的 patrol / blocked 阶段证据仍保留，可作为“从 patrol 推到 closeout”的完整链路样本

### 尾项
- 当前未见 replay-01 task-scoped closeout notification 的 failed audit

### 当前结论
- **replay-01 已完成在线 closeout；不再只是 partial bridge，而是第二个可复用的完整闭环样本**

### 主证据
- `docs/novel-factory/replay-online-bridge-20260421-153534/replay-01_closeout_summary.md`
- `docs/novel-factory/replay-online-bridge-20260421-153534/replay-01_closeout_result.json`
- `tmp/novel_factory_replays_20260417/three_replays_summary.json`

---

## 3. replay-02 在线桥接

### 当前状态
- **completed**

### 已完成
- live task/sub_task 完整落库
- 13 条 sub_task 全部 `done`
- 父 task 已 `completed`
- live workspace 已有 13 份产物
- `review_record = 13`
- `delivery activity_log = 13`
- `reward_log = 13`
- `notification_audit` 已出现多条 `task_completed(sent)` + `all_done(sent)`

### 尾项
- 历史上曾留有 1 条 `final-assembler` 的 `task_completed(failed)`（Feishu webhook `400 Bad Request`）
- 该问题已在 2026-04-25 完成重试/审计补强验证：后续 replay-01 `final-assembler` 已成功写入 `task_completed(sent)`，且连续 4 次 `task_completed` 验证样本均为 `sent`
- **当前不再把这条历史 failed audit 视为 replay-02 未收口尾项**

### 当前结论
- **replay-02 已完成在线 closeout，且对应的同类 `task_completed` 通知失败已完成验证性收口；它仍是当前最完整的单轮闭环样本**

### 主证据
- `docs/novel-factory/replay-online-bridge-20260421-141349/replay-02_closeout_summary.md`
- `docs/novel-factory/replay-online-bridge-20260421-141349/replay-02_closeout_result.json`
- `tmp/novel_factory_replays_20260417/three_replays_summary.json`

---

## 4. replay-03 在线桥接

### 当前状态
- **completed**

### 已完成
- live task：`c5620072-5f06-4edb-a811-d0bf1bb56965`
- 13 条 sub_task 已全部 `done`
- 父 task 已 `completed`
- live workspace 已有 13 份产物：`/workspace/tasks/novel-case-replay-03-20260425-114848_c5620072/`
- `review_record = 13`
- `delivery activity_log = 13`
- `reward_log = 13`
- `notification_audit` 已出现 **13 条 `task_completed(sent)` + 1 条 `all_done(sent)`**

### 尾项
- 当前未见 replay-03 task-scoped closeout notification 的 failed audit

### 当前结论
- **replay-03 已完成在线 closeout；它已经成为第三笔可复用的完整闭环样本，当前无需额外桥接决策**

### 主证据
- `docs/novel-factory/replay-online-bridge-20260425-114848/replay-03_closeout_summary.md`
- `docs/novel-factory/replay-online-bridge-20260425-114848/replay-03_closeout_result.json`
- `tmp/novel_factory_replays_20260417/three_replays_summary.json`

---

## 5. task_completed / all_done 通知稳定性尾项

### 当前状态
- **completed**

### 已知历史问题
- replay-02 曾留有 1 条：
  - `task_completed`
  - `status = failed`
  - `title = [OpenMOSS] 子任务已完成：最终组装 / final-assembler`
  - Feishu webhook `400 Bad Request`
  - `created_at = 2026-04-21T07:13:05.787302`

### 已完成验证
- 代码侧已补：Feishu webhook 串行化、最小发送间隔、瞬时 400 重试、`notification_audit` 持久化、结构化日志
- 单测已通过：`tests.test_notification_audit` + `tests.test_task_completion_notifications`
- live DB 复验：2026-04-25 replay-01 `final-assembler` 已出现 `task_completed(sent)`
- live DB 复验：`[OpenMOSS] 通知修复验证 1/4 ~ 4/4` 连续 4 条 `task_completed(sent)`，未新增同类 failed audit

### 当前结论
- **replay-02 那类 `task_completed`/`all_done` 通知失败已完成验证性收口；当前未再观察到同类 failed audit**
- 当前 `notification_audit` 中剩余 failed 样本仅见历史 `patrol_alert` 突发记录，属于另一类流量形态，暂不阻塞本轮主线 closeout

### 主证据
- `docs/novel-factory/replay-online-bridge-20260421-141349/replay-02_closeout_summary.md`
- `docs/novel-factory/replay-online-bridge-20260421-153534/replay-01_closeout_summary.md`

---

## 6. 小说工厂资产层

### 当前状态
- **partial**

### 已完成
- 单章节骨架模板已存在：`prompts/role/task-single-chapter-novel.md`
- 角色索引已存在：`feishu-8-agents/ROLE_INDEX.md`
- 小说岗位 prompt 已存在一批：
  - `planner-novel-planner.md`
  - `executor-plot-architect.md`
  - `executor-scene-architect.md`
  - `executor-final-assembler.md`
  - `executor-character-growth.md`
  - `executor-emotion-curve-designer.md`
  - `executor-opening-ending-designer.md`
  - `executor-revision-polish-expert.md`
  - `executor-psychological-portrayal-expert.md`
  - `reviewer-novel-reviewer.md`
  - `reviewer-style-consistency-checker.md`
  - `patrol-novel-patrol.md`
- DB 中还可见一批历史正式小说链在线角色注册（`hermes-official-online-20260418-061024-*`，共 15 个）
- 标准任务入口首版已固化：
  - `scripts/novel_factory/create_standard_novel_task_entry.py`
  - `tests/test_standard_novel_task_entry.py`
  - `scripts/novel_factory/run_standard_task_flow.py`
  - `tests/test_standard_task_flow_runner.py`
  - `scripts/novel_factory/examples/README.md`
  - `docs/novel-factory/standard-task-entry-live-runtime-runbook.md`
- 标准任务入口已具备：
  - plan-only 生成 manifest + bridge plan + entry summary
  - live runtime 直连创建 task/sub-task
  - 基于 live `/api/agents` 的自动 agent 映射
  - `OPENMOSS_BASE_URL` / `OPENMOSS_PLANNER_API_KEY` 环境变量回填
  - 一键串联标准任务创建 + closeout 摘要输出
- 新 runner 已在 2026-04-25 19:52 CST 补出一条新的 6565 live 现场样本：
  - runtime task：`a7ab496f-ee4f-43a7-a0ee-dc7c583eb346`
  - `sub_task done = 13`
  - `review_count = 13`
  - `reward_log_count = 13`
  - `notification_audit = 13 task_completed(sent) + 1 all_done(sent)`
  - 通知线程 drain：`waited=14`、`alive_after_wait=0`
- 同一条 runner 已在 2026-04-25 23:16 CST 补出一条新的 6565 live **静默 closeout** 现场样本：
  - runtime task：`493f4e04-1b18-484c-b0ba-6ca18d05dc36`
  - `sub_task done = 13`
  - `review_count = 13`
  - `reward_log_count = 13`
  - `notification_audit = 0`
  - `notification_drain = {"suppressed": true, "waited": false, "pending_jobs": 0}`
  - 说明一键入口已同时具备“正常通知版”与“静默验证版”两种 live 路径

### 未完成
- 当前 6565 live runtime 上的统一调度入口仍未收口成“稳定自动生产线”

### 当前结论
- **小说工厂已经不是“只有蓝图”**
- **标准任务入口首版已经落地，可持续重复创建标准骨架链**
- **一键创建 + closeout runner 已落地，且 6565 live 现场复跑证据已补齐；当前剩余问题主要是“稳定自动生产线”而不是“有没有入口”**

### 主证据
- `feishu-8-agents/ROLE_INDEX.md`
- `prompts/role/task-single-chapter-novel.md`
- `docs/novel-factory/novel-unified-registry-routing-map-20260425.md`
- `prompts/agents/*.md`
- `scripts/novel_factory/create_standard_novel_task_entry.py`
- `tests/test_standard_novel_task_entry.py`
- `scripts/novel_factory/run_standard_task_flow.py`
- `tests/test_standard_task_flow_runner.py`
- `scripts/novel_factory/examples/README.md`
- `docs/novel-factory/standard-task-entry-live-runtime-runbook.md`
- `docs/novel-factory/live-standard-flow-verify-20260425-195221.md`
- `docs/novel-factory/live-standard-flow-silent-verify-20260425-231617.md`
- live DB: `data/tasks.db`

---

## 四、当前总判断（只保留一句话）

### OpenMOSS
- **runtime 本体已完成；replay-01 / replay-02 / replay-03 已全部完成 live closeout。**

### 小说工厂
- **资产层已明显超过蓝图阶段；运行层已拿到新的 live runner 现场闭环证据，但还没收成统一稳定生产线。**

---

## 五、下一步执行顺序

1. **replay-03 completed 口径已同步到主要历史汇总文档**
   - 旧 gap audit / 看板 / checklist 审计，现均应以 2026-04-25 live closeout 证据为准。
2. **持续观察通知尾项，但不再把它视为主线 blocker**
   - 当前主链仅剩历史 `patrol_alert` failed 样本等稳定性尾项观察。
3. **统一注册表 / 调度映射表已完成沉淀**
   - 当前主证据为 `docs/novel-factory/novel-unified-registry-routing-map-20260425.md`。
4. **“全角色最小职责骨架链”已固化成标准任务入口首版**
   - 当前主证据为：
     - `scripts/novel_factory/create_standard_novel_task_entry.py`
     - `docs/novel-factory/standard-task-entry-live-runtime-runbook.md`
5. **把新 runner 从“已验证可跑”继续推进到“稳定自动生产线”**
   - 现场 live 证据已经补齐；下一步该盯的是调度稳定性、长期复用入口、以及是否要补 `activity_log(delivery)` 版本的标准样本。
