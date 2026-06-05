import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Template Dynamizer
 * 
 * Takes a base template + project context and adds extra steps
 * based on dynamize rules.
 */
export function registerTemplateDynamizer(absurd: Absurd) {
  absurd.registerTask(
    { name: "template-dynamizer" },
    async (params: { template: any; projectContext: any }, ctx: TaskContext) => {
      const { template, projectContext } = params;
      let steps = [...(template.base_steps || [])];

      // Simple rule evaluation
      for (const rule of template.dynamize_rules || []) {
        if (shouldApplyRule(rule, projectContext)) {
          for (const extra of rule.add || []) {
            steps.push({
              id: extra.agent,
              agent: extra.agent,
              depends_on: extra.depends_on || [],
            });
          }
        }
      }

      return {
        finalWorkflow: {
          ...template,
          steps,
        },
        dynamizedAt: new Date().toISOString(),
      };
    },
  );
}

function shouldApplyRule(rule: any, context: any): boolean {
  if (rule.if === "has_tailwind") return context.hasTailwind === true;
  if (rule.if === "has_dark_mode") return context.hasDarkMode === true;
  if (rule.if === "prefers_accessibility") return context.prefersAccessibility === true;
  return false;
}
