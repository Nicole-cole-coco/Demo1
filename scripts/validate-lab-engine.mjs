import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const nodeRequire = createRequire(import.meta.url);
const moduleCache = new Map();

function loadTypeScriptModule(filePath) {
  const resolvedPath = filePath.endsWith(".ts") ? filePath : `${filePath}.ts`;
  if (moduleCache.has(resolvedPath)) return moduleCache.get(resolvedPath).exports;

  const source = fs.readFileSync(resolvedPath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true
    }
  }).outputText;
  const module = { exports: {} };
  moduleCache.set(resolvedPath, module);

  const localRequire = (specifier) => {
    if (specifier.startsWith("@/")) {
      return loadTypeScriptModule(path.join(root, specifier.slice(2)));
    }
    if (specifier.startsWith(".")) {
      return loadTypeScriptModule(path.resolve(path.dirname(resolvedPath), specifier));
    }
    return nodeRequire(specifier);
  };

  const execute = new Function("require", "module", "exports", output);
  execute(localRequire, module, module.exports);
  return module.exports;
}

const { labScenarios } = loadTypeScriptModule(path.join(root, "lib", "labScenarios"));
const {
  applyRelationshipDelta,
  calculateRelationshipOutcome,
  createLabReport
} = loadTypeScriptModule(path.join(root, "lib", "labScoring"));

const fail = (message) => {
  throw new Error(`[lab validation] ${message}`);
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

function walkScenario(scenario, optionIndex) {
  let state = { ...scenario.initialRelationshipState };
  const choices = [];
  const relationshipHistory = [];

  scenario.stages.forEach((stage, index) => {
    assert(stage.round === index + 1, `${scenario.id} 的轮次编号不连续`);
    assert(stage.options.length === 4, `${scenario.id}/${stage.id} 必须提供四个选项`);

    stage.options.forEach((option) => {
      if (option.nextStage) {
        assert(
          scenario.stages.some((candidate) => candidate.id === option.nextStage),
          `${scenario.id}/${stage.id}/${option.id} 指向不存在的下一幕`
        );
      }
    });

    const option = stage.options[optionIndex];
    state = applyRelationshipDelta(state, option.relationshipDelta);
    Object.entries(state).forEach(([metric, value]) => {
      assert(value >= 0 && value <= 100, `${scenario.id} 的 ${metric} 超出 0-100`);
    });

    const targetMbti = scenario.targetMbti;
    const resolvedReaction = option.reactions?.[targetMbti] ?? option.reaction;
    choices.push({
      stageId: stage.id,
      optionId: option.id,
      label: option.label,
      intentTags: option.intentTags,
      scoreDelta: option.scoreDelta,
      relationshipDelta: option.relationshipDelta,
      reaction: option.reaction,
      resolvedReaction,
      advantage: option.advantage,
      tradeoff: option.tradeoff,
      resultingState: state
    });
    relationshipHistory.push({ stageId: stage.id, state, delta: option.relationshipDelta });
  });

  const report = createLabReport(
    scenario,
    {
      scenarioId: scenario.id,
      targetGender: "female",
      targetMbti: scenario.targetMbti,
      currentStageId: scenario.stages.at(-1).id,
      choices,
      relationshipState: state,
      relationshipHistory,
      startedAt: new Date().toISOString()
    },
    choices
  );

  assert(
    report.relationshipHistory.length === scenario.stages.length,
    `${scenario.id} 未生成完整关系轨迹`
  );
  assert(Boolean(report.interactionStyle), `${scenario.id} 未生成互动风格`);
  assert(Boolean(report.blindSpot), `${scenario.id} 未生成盲点建议`);
  assert(Boolean(report.relationshipOutcome), `${scenario.id} 未生成关系结果`);

  return { state, report };
}

const loverScenario = labScenarios.find((scenario) => scenario.id === "enfp-love-freedom");
assert(loverScenario, "缺少恋人争吵危机场景");
assert(labScenarios.length === 8, "旗舰场景数量必须为 8");
assert(new Set(labScenarios.map((scenario) => scenario.id)).size === 8, "场景 ID 必须唯一");
labScenarios.forEach((scenario) => {
  assert(scenario.difficulty >= 1 && scenario.difficulty <= 4, `${scenario.id} 难度无效`);
  assert(scenario.stages.every((stage) => Boolean(stage.beat)), `${scenario.id} 缺少剧情章节名称`);
  assert(
    scenario.stages.every((stage) =>
      stage.options.every((option) => Boolean(option.reactions?.[scenario.targetMbti]))
    ),
    `${scenario.id} 缺少目标人格的差异反馈`
  );
  walkScenario(scenario, 0);
});
assert(
  loverScenario.stages.length === 20,
  "恋人危机必须包含 20 个互动节点"
);
assert(
  loverScenario.stages.filter((stage) => stage.variants?.length).length >= 4,
  "恋人危机缺少状态驱动剧情分支"
);
assert((loverScenario.endings?.length ?? 0) >= 5, "恋人危机必须提供至少五种结局");

const enfpReaction = loverScenario.stages[0].options[0].reactions?.ENFP;
const intjReaction = loverScenario.stages[0].options[0].reactions?.INTJ;
assert(enfpReaction && intjReaction && enfpReaction !== intjReaction, "ENFP 与 INTJ 反馈没有体现差异");

const pathA = walkScenario(loverScenario, 0);
const pathB = walkScenario(loverScenario, 1);
const pathC = walkScenario(loverScenario, 2);
const pathD = walkScenario(loverScenario, 3);
assert(JSON.stringify(pathA.state) !== JSON.stringify(pathB.state), "不同决策路径产生了相同关系状态");
assert(
  calculateRelationshipOutcome(pathA.state).title && calculateRelationshipOutcome(pathB.state).title,
  "关系结果无法生成"
);
const reachableEndings = new Set(
  [pathA, pathB, pathC, pathD].map((path) => path.report.relationshipOutcome?.id)
);
assert(reachableEndings.size >= 3, "四条代表路径未能触达至少三种不同结局");

console.log(
  JSON.stringify(
    {
      status: "PASS",
      scenario: loverScenario.title,
      stages: loverScenario.stages.length,
      variants: loverScenario.stages.filter((stage) => stage.variants?.length).length,
      reachableEndings: Array.from(reachableEndings),
      pathA: pathA.report.relationshipOutcome,
      pathD: pathD.report.relationshipOutcome
    },
    null,
    2
  )
);
