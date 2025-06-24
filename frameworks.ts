
import { Framework, FrameworkComponentDetail, TranslationKey } from './types';
import { allTranslations } from './translations'; // Import allTranslations

// This is a mock 't' function for use *within* frameworks.ts only.
// It's used here to define framework-level strings like name, description, shortName, shortDescription.
// Component labels, examples, and tooltips are stored as TranslationKeys and translated at render time.
// For genericToolLinks name construction, we'll use a more direct approach.
const getTranslatedName = (key: string, lang: 'id' | 'en'): string => {
  const translationSet = lang === 'id' ? allTranslations.id : allTranslations.en;
  const value = translationSet[key];
  if (typeof value === 'string') {
    return value;
  }
  // Fallback if key is not a simple string (e.g. function, or not found)
  // This shouldn't happen for simple name keys.
  return key; 
};


// Standard tool links for TEXT framework, ordered by estimated popularity
const standardTextToolLinks = [
  { name: 'ChatGPT (OpenAI)', url: 'https://chat.openai.com/' },
  { name: 'Gemini (Google)', url: 'https://gemini.google.com/app' },
  { name: 'Copilot (Microsoft)', url: 'https://copilot.microsoft.com/' },
  { name: 'Claude (Anthropic)', url: 'https://claude.ai/chats/' },
  { name: 'Perplexity AI', url: 'https://www.perplexity.ai/' },
  { name: 'Meta AI', url: 'https://www.meta.ai/' },
  { name: 'Jasper', url: 'https://app.jasper.ai/' },
  { name: 'Copy.ai', url: 'https://app.copy.ai/' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com/' },
  { name: 'Blackbox AI', url: 'https://www.blackbox.ai/' },
];

// Helper function to merge tool links for TEXT framework
const mergeAndSortTextToolLinks = (existingLinks: { name:string; url: string }[] = []) => {
  const finalLinks = [...standardTextToolLinks];
  const standardUrls = new Set(standardTextToolLinks.map(link => link.url));
  const uniqueExistingLinks = existingLinks
    .filter(link => !standardUrls.has(link.url))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...finalLinks, ...uniqueExistingLinks];
};

// Standard alternative tools for IMAGE & VIDEO framework
const standardImageVideoAlternatives = [
  { name: 'Leonardo.Ai', url: 'https://app.leonardo.ai/' },
  { name: 'Playground AI', url: 'https://playground.com/' },
  { name: 'RunwayML (Gen-2, etc.)', url: 'https://app.runwayml.com/' },
  { name: 'Pika Labs', url: 'https://pika.art/' },
  { name: 'Adobe Firefly', url: 'https://firefly.adobe.com/' },
  { name: 'Canva Magic Media', url: 'https://www.canva.com/ai-image-generator/' },
  { name: 'Clipdrop (Stability AI Tools)', url: 'https://clipdrop.co/tools' },
  { name: 'Ideogram', url: 'https://ideogram.ai/' },
  { name: 'Kaiber.ai', url: 'https://kaiber.ai/' },
  { name: 'NightCafe Creator', url: 'https://creator.nightcafe.studio/' }
].sort((a, b) => a.name.localeCompare(b.name));

// Standard alternative tools for MUSIC framework
const standardMusicAlternatives = [
  { name: 'Udio', url: 'https://www.udio.com/' },
  { name: 'Stable Audio (Stability AI)', url: 'https://stableaudio.com/' },
  { name: 'Mubert', url: 'https://mubert.com/render' },
  { name: 'Suno AI', url: 'https://suno.com/'},
  { name: 'Google MusicFX (AI Test Kitchen)', url: 'https://aitestkitchen.withgoogle.com/tools/music-fx' }
].sort((a, b) => a.name.localeCompare(b.name));

// Helper function to create generic tool links for MEDIA and MUSIC framework
const createMediaMusicToolLinks = (
  officialFrameworkShortNameKey: TranslationKey,
  officialFrameworkUrl: string | undefined,
  alternativeTools: { name: string; url: string }[],
  lang: 'id' | 'en' // Language parameter for correct translation
) => {
  const links: { name: string; url: string }[] = [];
  const urlsPresent = new Set<string>();

  const translatedShortName = getTranslatedName(officialFrameworkShortNameKey, lang);
  const translatedSuffix = getTranslatedName('officialPlatformSuffix' as TranslationKey, lang);

  if (officialFrameworkUrl) {
    links.push({ name: `${translatedShortName} ${translatedSuffix}`, url: officialFrameworkUrl });
    urlsPresent.add(officialFrameworkUrl);
  }

  alternativeTools.forEach(altTool => {
    if (!urlsPresent.has(altTool.url)) {
      links.push(altTool); // Alt tool names are already strings, not translated via 't' here
      urlsPresent.add(altTool.url);
    }
  });
  return links.sort((a, b) => a.name.localeCompare(b.name));
};


export const frameworks: Framework[] = [
  // --- Text Frameworks ---
  {
    id: 'rtf',
    idLocale: {
      name: 'rtf_name',
      shortName: 'rtf_shortName',
      description: 'rtf_description_updated', 
      shortDescription: 'rtf_short_desc_updated', 
      category: 'text',
      components: [
        { id: 'role', label: 'rtf_role_label', example: 'rtf_role_example_updated', tooltip: 'rtf_role_tooltip_updated' },
        { id: 'task', label: 'rtf_task_label', example: 'rtf_task_example_updated', tooltip: 'rtf_task_tooltip_updated' },
        { id: 'format', label: 'rtf_format_label', example: 'rtf_format_example_updated', tooltip: 'rtf_format_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'rtf_name',
      shortName: 'rtf_shortName',
      description: 'rtf_description_updated', 
      shortDescription: 'rtf_short_desc_updated', 
      category: 'text',
      components: [
        { id: 'role', label: 'rtf_role_label', example: 'rtf_role_example_updated', tooltip: 'rtf_role_tooltip_updated' },
        { id: 'task', label: 'rtf_task_label', example: 'rtf_task_example_updated', tooltip: 'rtf_task_tooltip_updated' },
        { id: 'format', label: 'rtf_format_label', example: 'rtf_format_example_updated', tooltip: 'rtf_format_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'aida',
    idLocale: {
      name: 'aida_name',
      shortName: 'aida_shortName',
      description: 'aida_description_updated', 
      shortDescription: 'aida_short_desc_updated', 
      category: 'text',
      components: [
        { id: 'attention', label: 'aida_attention_label', example: 'aida_attention_example_updated', tooltip: 'aida_attention_tooltip_updated' },
        { id: 'interest', label: 'aida_interest_label', example: 'aida_interest_example_updated', tooltip: 'aida_interest_tooltip_updated' },
        { id: 'desire', label: 'aida_desire_label', example: 'aida_desire_example_updated', tooltip: 'aida_desire_tooltip_updated' },
        { id: 'action', label: 'aida_action_label', example: 'aida_action_example_updated', tooltip: 'aida_action_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'aida_name',
      shortName: 'aida_shortName',
      description: 'aida_description_updated', 
      shortDescription: 'aida_short_desc_updated', 
      category: 'text',
      components: [
        { id: 'attention', label: 'aida_attention_label', example: 'aida_attention_example_updated', tooltip: 'aida_attention_tooltip_updated' },
        { id: 'interest', label: 'aida_interest_label', example: 'aida_interest_example_updated', tooltip: 'aida_interest_tooltip_updated' },
        { id: 'desire', label: 'aida_desire_label', example: 'aida_desire_example_updated', tooltip: 'aida_desire_tooltip_updated' },
        { id: 'action', label: 'aida_action_label', example: 'aida_action_example_updated', tooltip: 'aida_action_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'care',
    idLocale: {
      name: 'care_name',
      shortName: 'care_shortName',
      description: 'care_description_updated',
      shortDescription: 'care_short_desc_updated',
      category: 'text',
      components: [
        { id: 'context', label: 'care_comp1_label', example: 'care_comp1_example_updated', tooltip: 'care_context_tooltip_updated' },
        { id: 'action', label: 'care_comp2_label', example: 'care_comp2_example_updated', tooltip: 'care_action_tooltip_updated' },
        { id: 'result', label: 'care_comp3_label', example: 'care_comp3_example_updated', tooltip: 'care_result_tooltip_updated' },
        { id: 'example', label: 'care_comp4_label', example: 'care_comp4_example_updated', tooltip: 'care_example_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'care_name',
      shortName: 'care_shortName',
      description: 'care_description_updated',
      shortDescription: 'care_short_desc_updated',
      category: 'text',
      components: [
        { id: 'context', label: 'care_comp1_label', example: 'care_comp1_example_updated', tooltip: 'care_context_tooltip_updated' },
        { id: 'action', label: 'care_comp2_label', example: 'care_comp2_example_updated', tooltip: 'care_action_tooltip_updated' },
        { id: 'result', label: 'care_comp3_label', example: 'care_comp3_example_updated', tooltip: 'care_result_tooltip_updated' },
        { id: 'example', label: 'care_comp4_label', example: 'care_comp4_example_updated', tooltip: 'care_example_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'co-star',
    idLocale: {
      name: 'co_star_name',
      shortName: 'co_star_shortName',
      description: 'co_star_description_updated',
      shortDescription: 'co_star_short_desc_updated',
      category: 'text',
      components: [
        { id: 'context', label: 'co_star_comp1_label', example: 'co_star_comp1_example_updated', tooltip: 'costar_context_tooltip_updated'},
        { id: 'objective', label: 'co_star_comp2_label', example: 'co_star_comp2_example_updated', tooltip: 'costar_objective_tooltip_updated'},
        { id: 'style', label: 'co_star_comp3_label', example: 'co_star_comp3_example_updated', tooltip: 'costar_style_tooltip_updated'},
        { id: 'tone', label: 'co_star_comp4_label', example: 'co_star_comp4_example_updated', tooltip: 'costar_tone_tooltip_updated'},
        { id: 'audience', label: 'co_star_comp5_label', example: 'co_star_comp5_example_updated', tooltip: 'costar_audience_tooltip_updated'},
        { id: 'response', label: 'co_star_comp6_label', example: 'co_star_comp6_example_updated', tooltip: 'costar_response_tooltip_updated'},
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'co_star_name',
      shortName: 'co_star_shortName',
      description: 'co_star_description_updated',
      shortDescription: 'co_star_short_desc_updated',
      category: 'text',
      components: [
        { id: 'context', label: 'co_star_comp1_label', example: 'co_star_comp1_example_updated', tooltip: 'costar_context_tooltip_updated'},
        { id: 'objective', label: 'co_star_comp2_label', example: 'co_star_comp2_example_updated', tooltip: 'costar_objective_tooltip_updated'},
        { id: 'style', label: 'co_star_comp3_label', example: 'co_star_comp3_example_updated', tooltip: 'costar_style_tooltip_updated'},
        { id: 'tone', label: 'co_star_comp4_label', example: 'co_star_comp4_example_updated', tooltip: 'costar_tone_tooltip_updated'},
        { id: 'audience', label: 'co_star_comp5_label', example: 'co_star_comp5_example_updated', tooltip: 'costar_audience_tooltip_updated'},
        { id: 'response', label: 'co_star_comp6_label', example: 'co_star_comp6_example_updated', tooltip: 'costar_response_tooltip_updated'},
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'rtf-c',
    idLocale: {
      name: 'rtf_c_name',
      shortName: 'rtf_c_shortName',
      description: 'rtf_c_description_updated',
      shortDescription: 'rtf_c_short_desc_updated',
      category: 'text',
      components: [
        { id: 'role', label: 'rtf_c_role_label', example: 'rtf_c_role_example_updated', tooltip: 'rtfc_role_tooltip_updated' },
        { id: 'task', label: 'rtf_c_task_label', example: 'rtf_c_task_example_updated', tooltip: 'rtfc_task_tooltip_updated' },
        { id: 'format', label: 'rtf_c_format_label', example: 'rtf_c_format_example_updated', tooltip: 'rtfc_format_tooltip_updated' },
        { id: 'context', label: 'rtf_c_context_label', example: 'rtf_c_context_example_updated', tooltip: 'rtfc_context_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'rtf_c_name',
      shortName: 'rtf_c_shortName',
      description: 'rtf_c_description_updated',
      shortDescription: 'rtf_c_short_desc_updated',
      category: 'text',
      components: [
        { id: 'role', label: 'rtf_c_role_label', example: 'rtf_c_role_example_updated', tooltip: 'rtfc_role_tooltip_updated' },
        { id: 'task', label: 'rtf_c_task_label', example: 'rtf_c_task_example_updated', tooltip: 'rtfc_task_tooltip_updated' },
        { id: 'format', label: 'rtf_c_format_label', example: 'rtf_c_format_example_updated', tooltip: 'rtfc_format_tooltip_updated' },
        { id: 'context', label: 'rtf_c_context_label', example: 'rtf_c_context_example_updated', tooltip: 'rtfc_context_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'bab',
    idLocale: {
      name: 'bab_name',
      shortName: 'bab_shortName',
      description: 'bab_description_updated',
      shortDescription: 'bab_short_desc_updated',
      category: 'text',
      components: [
        { id: 'before_state', label: 'bab_before_label', example: 'bab_before_example_updated', tooltip: 'bab_before_tooltip_updated' },
        { id: 'after_state', label: 'bab_after_label', example: 'bab_after_example_updated', tooltip: 'bab_after_tooltip_updated' },
        { id: 'bridge', label: 'bab_bridge_label', example: 'bab_bridge_example_updated', tooltip: 'bab_bridge_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'bab_name',
      shortName: 'bab_shortName',
      description: 'bab_description_updated',
      shortDescription: 'bab_short_desc_updated',
      category: 'text',
      components: [
        { id: 'before_state', label: 'bab_before_label', example: 'bab_before_example_updated', tooltip: 'bab_before_tooltip_updated' },
        { id: 'after_state', label: 'bab_after_label', example: 'bab_after_example_updated', tooltip: 'bab_after_tooltip_updated' },
        { id: 'bridge', label: 'bab_bridge_label', example: 'bab_bridge_example_updated', tooltip: 'bab_bridge_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'icio',
    idLocale: {
        name: 'icio_name',
        shortName: 'icio_shortName',
        description: 'icio_description_updated',
        shortDescription: 'icio_short_desc_updated',
        category: 'text',
        components: [
            { id: 'instruction', label: 'icio_instruction_label', example: 'icio_instruction_example_updated', tooltip: 'icio_instruction_tooltip_updated' },
            { id: 'context', label: 'icio_context_label', example: 'icio_context_example_updated', tooltip: 'icio_context_tooltip_updated' },
            { id: 'input_data', label: 'icio_input_label', example: 'icio_input_example_updated', tooltip: 'icio_input_tooltip_updated' },
            { id: 'output_indicator', label: 'icio_output_label', example: 'icio_output_example_updated', tooltip: 'icio_output_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'icio_name',
        shortName: 'icio_shortName',
        description: 'icio_description_updated',
        shortDescription: 'icio_short_desc_updated',
        category: 'text',
        components: [
            { id: 'instruction', label: 'icio_instruction_label', example: 'icio_instruction_example_updated', tooltip: 'icio_instruction_tooltip_updated' },
            { id: 'context', label: 'icio_context_label', example: 'icio_context_example_updated', tooltip: 'icio_context_tooltip_updated' },
            { id: 'input_data', label: 'icio_input_label', example: 'icio_input_example_updated', tooltip: 'icio_input_tooltip_updated' },
            { id: 'output_indicator', label: 'icio_output_label', example: 'icio_output_example_updated', tooltip: 'icio_output_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'rascef',
    idLocale: {
        name: 'rascef_name',
        shortName: 'rascef_shortName',
        description: 'rascef_description_updated',
        shortDescription: 'rascef_short_desc_updated',
        category: 'text',
        components: [
            { id: 'role', label: 'rascef_role_label', example: 'rascef_role_example_updated', tooltip: 'rascef_role_tooltip_updated' },
            { id: 'action', label: 'rascef_action_label', example: 'rascef_action_example_updated', tooltip: 'rascef_action_tooltip_updated' },
            { id: 'steps', label: 'rascef_steps_label', example: 'rascef_steps_example_updated', tooltip: 'rascef_steps_tooltip_updated' },
            { id: 'context', label: 'rascef_context_label', example: 'rascef_context_example_updated', tooltip: 'rascef_context_tooltip_updated' },
            { id: 'examples', label: 'rascef_examples_label', example: 'rascef_examples_example_updated', tooltip: 'rascef_examples_tooltip_updated' },
            { id: 'format', label: 'rascef_format_label', example: 'rascef_format_example_updated', tooltip: 'rascef_format_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'rascef_name',
        shortName: 'rascef_shortName',
        description: 'rascef_description_updated',
        shortDescription: 'rascef_short_desc_updated',
        category: 'text',
        components: [
            { id: 'role', label: 'rascef_role_label', example: 'rascef_role_example_updated', tooltip: 'rascef_role_tooltip_updated' },
            { id: 'action', label: 'rascef_action_label', example: 'rascef_action_example_updated', tooltip: 'rascef_action_tooltip_updated' },
            { id: 'steps', label: 'rascef_steps_label', example: 'rascef_steps_example_updated', tooltip: 'rascef_steps_tooltip_updated' },
            { id: 'context', label: 'rascef_context_label', example: 'rascef_context_example_updated', tooltip: 'rascef_context_tooltip_updated' },
            { id: 'examples', label: 'rascef_examples_label', example: 'rascef_examples_example_updated', tooltip: 'rascef_examples_tooltip_updated' },
            { id: 'format', label: 'rascef_format_label', example: 'rascef_format_example_updated', tooltip: 'rascef_format_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'tag',
    idLocale: {
      name: 'tag_name',
      shortName: 'tag_shortName',
      description: 'tag_description_updated',
      shortDescription: 'tag_short_desc_updated',
      category: 'text',
      components: [
        { id: 'task', label: 'tag_comp1_label', example: 'tag_comp1_example_updated', tooltip: 'tag_task_tooltip_updated' },
        { id: 'action', label: 'tag_comp2_label', example: 'tag_comp2_example_updated', tooltip: 'tag_action_tooltip_updated' },
        { id: 'goal', label: 'tag_comp3_label', example: 'tag_comp3_example_updated', tooltip: 'tag_goal_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'tag_name',
      shortName: 'tag_shortName',
      description: 'tag_description_updated',
      shortDescription: 'tag_short_desc_updated',
      category: 'text',
      components: [
        { id: 'task', label: 'tag_comp1_label', example: 'tag_comp1_example_updated', tooltip: 'tag_task_tooltip_updated' },
        { id: 'action', label: 'tag_comp2_label', example: 'tag_comp2_example_updated', tooltip: 'tag_action_tooltip_updated' },
        { id: 'goal', label: 'tag_comp3_label', example: 'tag_comp3_example_updated', tooltip: 'tag_goal_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'pas',
    idLocale: {
        name: 'pas_name',
        shortName: 'pas_shortName',
        description: 'pas_description_updated',
        shortDescription: 'pas_short_desc_updated',
        category: 'text',
        components: [
            { id: 'problem', label: 'pas_comp1_label', example: 'pas_comp1_example_updated', tooltip: 'pas_problem_tooltip_updated' },
            { id: 'agitate', label: 'pas_comp2_label', example: 'pas_comp2_example_updated', tooltip: 'pas_agitate_tooltip_updated' },
            { id: 'solution', label: 'pas_comp3_label', example: 'pas_comp3_example_updated', tooltip: 'pas_solution_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'pas_name',
        shortName: 'pas_shortName',
        description: 'pas_description_updated',
        shortDescription: 'pas_short_desc_updated',
        category: 'text',
        components: [
            { id: 'problem', label: 'pas_comp1_label', example: 'pas_comp1_example_updated', tooltip: 'pas_problem_tooltip_updated' },
            { id: 'agitate', label: 'pas_comp2_label', example: 'pas_comp2_example_updated', tooltip: 'pas_agitate_tooltip_updated' },
            { id: 'solution', label: 'pas_comp3_label', example: 'pas_comp3_example_updated', tooltip: 'pas_solution_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'cot',
    idLocale: {
        name: 'cot_name',
        shortName: 'cot_shortName',
        description: 'cot_description_updated',
        shortDescription: 'cot_short_desc_updated',
        category: 'text',
        components: [
            { id: 'problem_exemplar', label: 'cot_comp1_label', example: 'cot_comp1_example_updated', tooltip: 'cot_problem_exemplar_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'cot_name',
        shortName: 'cot_shortName',
        description: 'cot_description_updated',
        shortDescription: 'cot_short_desc_updated',
        category: 'text',
        components: [
            { id: 'problem_exemplar', label: 'cot_comp1_label', example: 'cot_comp1_example_updated', tooltip: 'cot_problem_exemplar_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'zero-shot-cot',
    idLocale: {
        name: 'zero_shot_cot_name',
        shortName: 'zero_shot_cot_shortName',
        description: 'zero_shot_cot_description_updated',
        shortDescription: 'zero_shot_cot_short_desc_updated',
        category: 'text',
        components: [
            { id: 'problem_trigger', label: 'zero_shot_cot_comp1_label', example: 'zero_shot_cot_comp1_example_updated', tooltip: 'zeroshotcot_problem_trigger_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'zero_shot_cot_name',
        shortName: 'zero_shot_cot_shortName',
        description: 'zero_shot_cot_description_updated',
        shortDescription: 'zero_shot_cot_short_desc_updated',
        category: 'text',
        components: [
            { id: 'problem_trigger', label: 'zero_shot_cot_comp1_label', example: 'zero_shot_cot_comp1_example_updated', tooltip: 'zeroshotcot_problem_trigger_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'fab',
    idLocale: {
        name: 'fab_name',
        shortName: 'fab_shortName',
        description: 'fab_description_updated',
        shortDescription: 'fab_short_desc_updated',
        category: 'text',
        components: [
            { id: 'features', label: 'fab_comp1_label', example: 'fab_comp1_example_updated', tooltip: 'fab_features_tooltip_updated' },
            { id: 'advantages', label: 'fab_comp2_label', example: 'fab_comp2_example_updated', tooltip: 'fab_advantages_tooltip_updated' },
            { id: 'benefits', label: 'fab_comp3_label', example: 'fab_comp3_example_updated', tooltip: 'fab_benefits_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'fab_name',
        shortName: 'fab_shortName',
        description: 'fab_description_updated',
        shortDescription: 'fab_short_desc_updated',
        category: 'text',
        components: [
            { id: 'features', label: 'fab_comp1_label', example: 'fab_comp1_example_updated', tooltip: 'fab_features_tooltip_updated' },
            { id: 'advantages', label: 'fab_comp2_label', example: 'fab_comp2_example_updated', tooltip: 'fab_advantages_tooltip_updated' },
            { id: 'benefits', label: 'fab_comp3_label', example: 'fab_comp3_example_updated', tooltip: 'fab_benefits_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'prepare',
    idLocale: {
        name: 'prepare_name',
        shortName: 'prepare_shortName',
        description: 'prepare_description_updated',
        shortDescription: 'prepare_short_desc_updated',
        category: 'text',
        components: [
            { id: 'purpose', label: 'prepare_comp1_label', example: 'prepare_comp1_example_updated', tooltip: 'prepare_purpose_tooltip_updated' },
            { id: 'requirements', label: 'prepare_comp2_label', example: 'prepare_comp2_example_updated', tooltip: 'prepare_requirements_tooltip_updated' },
            { id: 'examples', label: 'prepare_comp3_label', example: 'prepare_comp3_example_updated', tooltip: 'prepare_examples_tooltip_updated' },
            { id: 'persona', label: 'prepare_comp4_label', example: 'prepare_comp4_example_updated', tooltip: 'prepare_persona_tooltip_updated' },
            { id: 'action', label: 'prepare_comp5_label', example: 'prepare_comp5_example_updated', tooltip: 'prepare_action_tooltip_updated' },
            { id: 'refinements', label: 'prepare_comp6_label', example: 'prepare_comp6_example_updated', tooltip: 'prepare_refinements_tooltip_updated' },
            { id: 'evaluation', label: 'prepare_comp7_label', example: 'prepare_comp7_example_updated', tooltip: 'prepare_evaluation_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'prepare_name',
        shortName: 'prepare_shortName',
        description: 'prepare_description_updated',
        shortDescription: 'prepare_short_desc_updated',
        category: 'text',
        components: [
            { id: 'purpose', label: 'prepare_comp1_label', example: 'prepare_comp1_example_updated', tooltip: 'prepare_purpose_tooltip_updated' },
            { id: 'requirements', label: 'prepare_comp2_label', example: 'prepare_comp2_example_updated', tooltip: 'prepare_requirements_tooltip_updated' },
            { id: 'examples', label: 'prepare_comp3_label', example: 'prepare_comp3_example_updated', tooltip: 'prepare_examples_tooltip_updated' },
            { id: 'persona', label: 'prepare_comp4_label', example: 'prepare_comp4_example_updated', tooltip: 'prepare_persona_tooltip_updated' },
            { id: 'action', label: 'prepare_comp5_label', example: 'prepare_comp5_example_updated', tooltip: 'prepare_action_tooltip_updated' },
            { id: 'refinements', label: 'prepare_comp6_label', example: 'prepare_comp6_example_updated', tooltip: 'prepare_refinements_tooltip_updated' },
            { id: 'evaluation', label: 'prepare_comp7_label', example: 'prepare_comp7_example_updated', tooltip: 'prepare_evaluation_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'google-guide',
    idLocale: {
        name: 'google_guide_name',
        shortName: 'google_guide_shortName',
        description: 'google_guide_description_updated',
        shortDescription: 'google_guide_short_desc_updated',
        category: 'text',
        components: [
            { id: 'understand_need', label: 'google_guide_comp1_label', example: 'google_guide_comp1_example_updated', tooltip: 'googleguide_understand_tooltip_updated' },
            { id: 'provide_examples', label: 'google_guide_comp2_label', example: 'google_guide_comp2_example_updated', tooltip: 'googleguide_examples_tooltip_updated' },
            { id: 'specific_concise', label: 'google_guide_comp3_label', example: 'google_guide_comp3_example_updated', tooltip: 'googleguide_specific_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'google_guide_name',
        shortName: 'google_guide_shortName',
        description: 'google_guide_description_updated',
        shortDescription: 'google_guide_short_desc_updated',
        category: 'text',
        components: [
            { id: 'understand_need', label: 'google_guide_comp1_label', example: 'google_guide_comp1_example_updated', tooltip: 'googleguide_understand_tooltip_updated' },
            { id: 'provide_examples', label: 'google_guide_comp2_label', example: 'google_guide_comp2_example_updated', tooltip: 'googleguide_examples_tooltip_updated' },
            { id: 'specific_concise', label: 'google_guide_comp3_label', example: 'google_guide_comp3_example_updated', tooltip: 'googleguide_specific_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'cidi',
    idLocale: {
        name: 'cidi_name',
        shortName: 'cidi_shortName',
        description: 'cidi_description_updated',
        shortDescription: 'cidi_short_desc_updated',
        category: 'text',
        components: [
            { id: 'context', label: 'cidi_comp1_label', example: 'cidi_comp1_example_updated', tooltip: 'cidi_context_tooltip_updated' },
            { id: 'input_data', label: 'cidi_comp2_label', example: 'cidi_comp2_example_updated', tooltip: 'cidi_input_tooltip_updated' },
            { id: 'desired_output', label: 'cidi_comp3_label', example: 'cidi_comp3_example_updated', tooltip: 'cidi_output_tooltip_updated' },
            { id: 'intent', label: 'cidi_comp4_label', example: 'cidi_comp4_example_updated', tooltip: 'cidi_intent_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'cidi_name',
        shortName: 'cidi_shortName',
        description: 'cidi_description_updated',
        shortDescription: 'cidi_short_desc_updated',
        category: 'text',
        components: [
            { id: 'context', label: 'cidi_comp1_label', example: 'cidi_comp1_example_updated', tooltip: 'cidi_context_tooltip_updated' },
            { id: 'input_data', label: 'cidi_comp2_label', example: 'cidi_comp2_example_updated', tooltip: 'cidi_input_tooltip_updated' },
            { id: 'desired_output', label: 'cidi_comp3_label', example: 'cidi_comp3_example_updated', tooltip: 'cidi_output_tooltip_updated' },
            { id: 'intent', label: 'cidi_comp4_label', example: 'cidi_comp4_example_updated', tooltip: 'cidi_intent_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'rise',
    idLocale: {
        name: 'rise_name',
        shortName: 'rise_shortName',
        description: 'rise_description_updated',
        shortDescription: 'rise_short_desc_updated',
        category: 'text',
        components: [
            { id: 'role', label: 'rise_comp1_label', example: 'rise_comp1_example_updated', tooltip: 'rise_role_tooltip_updated' },
            { id: 'input', label: 'rise_comp2_label', example: 'rise_comp2_example_updated', tooltip: 'rise_input_tooltip_updated' },
            { id: 'steps', label: 'rise_comp3_label', example: 'rise_comp3_example_updated', tooltip: 'rise_steps_tooltip_updated' },
            { id: 'expectation', label: 'rise_comp4_label', example: 'rise_comp4_example_updated', tooltip: 'rise_expectation_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'rise_name',
        shortName: 'rise_shortName',
        description: 'rise_description_updated',
        shortDescription: 'rise_short_desc_updated',
        category: 'text',
        components: [
            { id: 'role', label: 'rise_comp1_label', example: 'rise_comp1_example_updated', tooltip: 'rise_role_tooltip_updated' },
            { id: 'input', label: 'rise_comp2_label', example: 'rise_comp2_example_updated', tooltip: 'rise_input_tooltip_updated' },
            { id: 'steps', label: 'rise_comp3_label', example: 'rise_comp3_example_updated', tooltip: 'rise_steps_tooltip_updated' },
            { id: 'expectation', label: 'rise_comp4_label', example: 'rise_comp4_example_updated', tooltip: 'rise_expectation_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'race',
    idLocale: {
        name: 'race_name',
        shortName: 'race_shortName',
        description: 'race_description_updated',
        shortDescription: 'race_short_desc_updated',
        category: 'text',
        components: [
            { id: 'role', label: 'race_comp1_label', example: 'race_comp1_example_updated', tooltip: 'race_role_tooltip_updated' },
            { id: 'action', label: 'race_comp2_label', example: 'race_comp2_example_updated', tooltip: 'race_action_tooltip_updated' },
            { id: 'context', label: 'race_comp3_label', example: 'race_comp3_example_updated', tooltip: 'race_context_tooltip_updated' },
            { id: 'example', label: 'race_comp4_label', example: 'race_comp4_example_updated', tooltip: 'race_example_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'race_name',
        shortName: 'race_shortName',
        description: 'race_description_updated',
        shortDescription: 'race_short_desc_updated',
        category: 'text',
        components: [
            { id: 'role', label: 'race_comp1_label', example: 'race_comp1_example_updated', tooltip: 'race_role_tooltip_updated' },
            { id: 'action', label: 'race_comp2_label', example: 'race_comp2_example_updated', tooltip: 'race_action_tooltip_updated' },
            { id: 'context', label: 'race_comp3_label', example: 'race_comp3_example_updated', tooltip: 'race_context_tooltip_updated' },
            { id: 'example', label: 'race_comp4_label', example: 'race_comp4_example_updated', tooltip: 'race_example_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'trace',
    idLocale: {
        name: 'trace_name',
        shortName: 'trace_shortName',
        description: 'trace_description_updated',
        shortDescription: 'trace_short_desc_updated',
        category: 'text',
        components: [
            { id: 'task', label: 'trace_comp1_label', example: 'trace_comp1_example_updated', tooltip: 'trace_task_tooltip_updated' },
            { id: 'request', label: 'trace_comp2_label', example: 'trace_comp2_example_updated', tooltip: 'trace_request_tooltip_updated' },
            { id: 'action', label: 'trace_comp3_label', example: 'trace_comp3_example_updated', tooltip: 'trace_action_tooltip_updated' },
            { id: 'context', label: 'trace_comp4_label', example: 'trace_comp4_example_updated', tooltip: 'trace_context_tooltip_updated' },
            { id: 'example', label: 'trace_comp5_label', example: 'trace_comp5_example_updated', tooltip: 'trace_example_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'trace_name',
        shortName: 'trace_shortName',
        description: 'trace_description_updated',
        shortDescription: 'trace_short_desc_updated',
        category: 'text',
        components: [
            { id: 'task', label: 'trace_comp1_label', example: 'trace_comp1_example_updated', tooltip: 'trace_task_tooltip_updated' },
            { id: 'request', label: 'trace_comp2_label', example: 'trace_comp2_example_updated', tooltip: 'trace_request_tooltip_updated' },
            { id: 'action', label: 'trace_comp3_label', example: 'trace_comp3_example_updated', tooltip: 'trace_action_tooltip_updated' },
            { id: 'context', label: 'trace_comp4_label', example: 'trace_comp4_example_updated', tooltip: 'trace_context_tooltip_updated' },
            { id: 'example', label: 'trace_comp5_label', example: 'trace_comp5_example_updated', tooltip: 'trace_example_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'crispe',
    idLocale: {
        name: 'crispe_name',
        shortName: 'crispe_shortName',
        description: 'crispe_description_updated',
        shortDescription: 'crispe_short_desc_updated',
        category: 'text',
        components: [
            { id: 'capacity_role', label: 'crispe_comp1_label', example: 'crispe_comp1_example_updated', tooltip: 'crispe_capacity_tooltip_updated' },
            { id: 'insight', label: 'crispe_comp2_label', example: 'crispe_comp2_example_updated', tooltip: 'crispe_insight_tooltip_updated' },
            { id: 'statement', label: 'crispe_comp3_label', example: 'crispe_comp3_example_updated', tooltip: 'crispe_statement_tooltip_updated' },
            { id: 'personality', label: 'crispe_comp4_label', example: 'crispe_comp4_example_updated', tooltip: 'crispe_personality_tooltip_updated' },
            { id: 'experiment', label: 'crispe_comp5_label', example: 'crispe_comp5_example_updated', tooltip: 'crispe_experiment_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'crispe_name',
        shortName: 'crispe_shortName',
        description: 'crispe_description_updated',
        shortDescription: 'crispe_short_desc_updated',
        category: 'text',
        components: [
            { id: 'capacity_role', label: 'crispe_comp1_label', example: 'crispe_comp1_example_updated', tooltip: 'crispe_capacity_tooltip_updated' },
            { id: 'insight', label: 'crispe_comp2_label', example: 'crispe_comp2_example_updated', tooltip: 'crispe_insight_tooltip_updated' },
            { id: 'statement', label: 'crispe_comp3_label', example: 'crispe_comp3_example_updated', tooltip: 'crispe_statement_tooltip_updated' },
            { id: 'personality', label: 'crispe_comp4_label', example: 'crispe_comp4_example_updated', tooltip: 'crispe_personality_tooltip_updated' },
            { id: 'experiment', label: 'crispe_comp5_label', example: 'crispe_comp5_example_updated', tooltip: 'crispe_experiment_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'ape',
    idLocale: {
        name: 'ape_name',
        shortName: 'ape_shortName',
        description: 'ape_description_updated',
        shortDescription: 'ape_short_desc_updated',
        category: 'text',
        components: [
            { id: 'action', label: 'ape_comp1_label', example: 'ape_comp1_example_updated', tooltip: 'ape_action_tooltip_updated' },
            { id: 'purpose', label: 'ape_comp2_label', example: 'ape_comp2_example_updated', tooltip: 'ape_purpose_tooltip_updated' },
            { id: 'expectation', label: 'ape_comp3_label', example: 'ape_comp3_example_updated', tooltip: 'ape_expectation_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'ape_name',
        shortName: 'ape_shortName',
        description: 'ape_description_updated',
        shortDescription: 'ape_short_desc_updated',
        category: 'text',
        components: [
            { id: 'action', label: 'ape_comp1_label', example: 'ape_comp1_example_updated', tooltip: 'ape_action_tooltip_updated' },
            { id: 'purpose', label: 'ape_comp2_label', example: 'ape_comp2_example_updated', tooltip: 'ape_purpose_tooltip_updated' },
            { id: 'expectation', label: 'ape_comp3_label', example: 'ape_comp3_example_updated', tooltip: 'ape_expectation_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'star',
    idLocale: {
        name: 'star_name',
        shortName: 'star_shortName',
        description: 'star_description_updated',
        shortDescription: 'star_short_desc_updated',
        category: 'text',
        components: [
            { id: 'situation', label: 'star_comp1_label', example: 'star_comp1_example_updated', tooltip: 'star_situation_tooltip_updated' },
            { id: 'task', label: 'star_comp2_label', example: 'star_comp2_example_updated', tooltip: 'star_task_tooltip_updated' },
            { id: 'action', label: 'star_comp3_label', example: 'star_comp3_example_updated', tooltip: 'star_action_tooltip_updated' },
            { id: 'result', label: 'star_comp4_label', example: 'star_comp4_example_updated', tooltip: 'star_result_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'star_name',
        shortName: 'star_shortName',
        description: 'star_description_updated',
        shortDescription: 'star_short_desc_updated',
        category: 'text',
        components: [
            { id: 'situation', label: 'star_comp1_label', example: 'star_comp1_example_updated', tooltip: 'star_situation_tooltip_updated' },
            { id: 'task', label: 'star_comp2_label', example: 'star_comp2_example_updated', tooltip: 'star_task_tooltip_updated' },
            { id: 'action', label: 'star_comp3_label', example: 'star_comp3_example_updated', tooltip: 'star_action_tooltip_updated' },
            { id: 'result', label: 'star_comp4_label', example: 'star_comp4_example_updated', tooltip: 'star_result_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'ctf',
    idLocale: {
        name: 'ctf_name',
        shortName: 'ctf_shortName',
        description: 'ctf_description_updated',
        shortDescription: 'ctf_short_desc_updated',
        category: 'text',
        components: [
            { id: 'context', label: 'ctf_comp1_label', example: 'ctf_comp1_example_updated', tooltip: 'ctf_context_tooltip_updated' },
            { id: 'task', label: 'ctf_comp2_label', example: 'ctf_comp2_example_updated', tooltip: 'ctf_task_tooltip_updated' },
            { id: 'format', label: 'ctf_comp3_label', example: 'ctf_comp3_example_updated', tooltip: 'ctf_format_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'ctf_name',
        shortName: 'ctf_shortName',
        description: 'ctf_description_updated',
        shortDescription: 'ctf_short_desc_updated',
        category: 'text',
        components: [
            { id: 'context', label: 'ctf_comp1_label', example: 'ctf_comp1_example_updated', tooltip: 'ctf_context_tooltip_updated' },
            { id: 'task', label: 'ctf_comp2_label', example: 'ctf_comp2_example_updated', tooltip: 'ctf_task_tooltip_updated' },
            { id: 'format', label: 'ctf_comp3_label', example: 'ctf_comp3_example_updated', tooltip: 'ctf_format_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'tref',
    idLocale: {
        name: 'tref_name',
        shortName: 'tref_shortName',
        description: 'tref_description_updated',
        shortDescription: 'tref_short_desc_updated',
        category: 'text',
        components: [
            { id: 'task', label: 'tref_comp1_label', example: 'tref_comp1_example_updated', tooltip: 'tref_task_tooltip_updated' },
            { id: 'role', label: 'tref_comp2_label', example: 'tref_comp2_example_updated', tooltip: 'tref_role_tooltip_updated' },
            { id: 'example', label: 'tref_comp3_label', example: 'tref_comp3_example_updated', tooltip: 'tref_example_tooltip_updated' },
            { id: 'format', label: 'tref_comp4_label', example: 'tref_comp4_example_updated', tooltip: 'tref_format_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'tref_name',
        shortName: 'tref_shortName',
        description: 'tref_description_updated',
        shortDescription: 'tref_short_desc_updated',
        category: 'text',
        components: [
            { id: 'task', label: 'tref_comp1_label', example: 'tref_comp1_example_updated', tooltip: 'tref_task_tooltip_updated' },
            { id: 'role', label: 'tref_comp2_label', example: 'tref_comp2_example_updated', tooltip: 'tref_role_tooltip_updated' },
            { id: 'example', label: 'tref_comp3_label', example: 'tref_comp3_example_updated', tooltip: 'tref_example_tooltip_updated' },
            { id: 'format', label: 'tref_comp4_label', example: 'tref_comp4_example_updated', tooltip: 'tref_format_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'grade',
    idLocale: {
        name: 'grade_name',
        shortName: 'grade_shortName',
        description: 'grade_description_updated',
        shortDescription: 'grade_short_desc_updated',
        category: 'text',
        components: [
            { id: 'goal', label: 'grade_comp1_label', example: 'grade_comp1_example_updated', tooltip: 'grade_goal_tooltip_updated' },
            { id: 'request', label: 'grade_comp2_label', example: 'grade_comp2_example_updated', tooltip: 'grade_request_tooltip_updated' },
            { id: 'action', label: 'grade_comp3_label', example: 'grade_comp3_example_updated', tooltip: 'grade_action_tooltip_updated' },
            { id: 'detail', label: 'grade_comp4_label', example: 'grade_comp4_example_updated', tooltip: 'grade_detail_tooltip_updated' },
            { id: 'example', label: 'grade_comp5_label', example: 'grade_comp5_example_updated', tooltip: 'grade_example_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'grade_name',
        shortName: 'grade_shortName',
        description: 'grade_description_updated',
        shortDescription: 'grade_short_desc_updated',
        category: 'text',
        components: [
            { id: 'goal', label: 'grade_comp1_label', example: 'grade_comp1_example_updated', tooltip: 'grade_goal_tooltip_updated' },
            { id: 'request', label: 'grade_comp2_label', example: 'grade_comp2_example_updated', tooltip: 'grade_request_tooltip_updated' },
            { id: 'action', label: 'grade_comp3_label', example: 'grade_comp3_example_updated', tooltip: 'grade_action_tooltip_updated' },
            { id: 'detail', label: 'grade_comp4_label', example: 'grade_comp4_example_updated', tooltip: 'grade_detail_tooltip_updated' },
            { id: 'example', label: 'grade_comp5_label', example: 'grade_comp5_example_updated', tooltip: 'grade_example_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'roses',
    idLocale: {
        name: 'roses_name',
        shortName: 'roses_shortName',
        description: 'roses_description_updated',
        shortDescription: 'roses_short_desc_updated',
        category: 'text',
        components: [
            { id: 'role', label: 'roses_comp1_label', example: 'roses_comp1_example_updated', tooltip: 'roses_role_tooltip_updated' },
            { id: 'objective', label: 'roses_comp2_label', example: 'roses_comp2_example_updated', tooltip: 'roses_objective_tooltip_updated' },
            { id: 'scenario', label: 'roses_comp3_label', example: 'roses_comp3_example_updated', tooltip: 'roses_scenario_tooltip_updated' },
            { id: 'expected_solution', label: 'roses_comp4_label', example: 'roses_comp4_example_updated', tooltip: 'roses_solution_tooltip_updated' },
            { id: 'steps', label: 'roses_comp5_label', example: 'roses_comp5_example_updated', tooltip: 'roses_steps_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
        name: 'roses_name',
        shortName: 'roses_shortName',
        description: 'roses_description_updated',
        shortDescription: 'roses_short_desc_updated',
        category: 'text',
        components: [
            { id: 'role', label: 'roses_comp1_label', example: 'roses_comp1_example_updated', tooltip: 'roses_role_tooltip_updated' },
            { id: 'objective', label: 'roses_comp2_label', example: 'roses_comp2_example_updated', tooltip: 'roses_objective_tooltip_updated' },
            { id: 'scenario', label: 'roses_comp3_label', example: 'roses_comp3_example_updated', tooltip: 'roses_scenario_tooltip_updated' },
            { id: 'expected_solution', label: 'roses_comp4_label', example: 'roses_comp4_example_updated', tooltip: 'roses_solution_tooltip_updated' },
            { id: 'steps', label: 'roses_comp5_label', example: 'roses_comp5_example_updated', tooltip: 'roses_steps_tooltip_updated' },
        ],
        genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'ride',
    idLocale: {
      name: 'ride_name',
      shortName: 'ride_shortName',
      description: 'ride_description_updated',
      shortDescription: 'ride_short_desc_updated',
      category: 'text',
      components: [
        { id: 'role', label: 'ride_role_label', example: 'ride_role_example_updated', tooltip: 'ride_role_tooltip_updated' },
        { id: 'instruction', label: 'ride_instruction_label', example: 'ride_instruction_example_updated', tooltip: 'ride_instruction_tooltip_updated' },
        { id: 'details', label: 'ride_details_label', example: 'ride_details_example_updated', tooltip: 'ride_details_tooltip_updated' },
        { id: 'example', label: 'ride_example_label', example: 'ride_example_example_updated', tooltip: 'ride_example_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'ride_name',
      shortName: 'ride_shortName',
      description: 'ride_description_updated',
      shortDescription: 'ride_short_desc_updated',
      category: 'text',
      components: [
        { id: 'role', label: 'ride_role_label', example: 'ride_role_example_updated', tooltip: 'ride_role_tooltip_updated' },
        { id: 'instruction', label: 'ride_instruction_label', example: 'ride_instruction_example_updated', tooltip: 'ride_instruction_tooltip_updated' },
        { id: 'details', label: 'ride_details_label', example: 'ride_details_example_updated', tooltip: 'ride_details_tooltip_updated' },
        { id: 'example', label: 'ride_example_label', example: 'ride_example_example_updated', tooltip: 'ride_example_tooltip_updated' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'scenecraft-detailer',
    idLocale: {
      name: 'scenecraft_name',
      shortName: 'scenecraft_shortName',
      description: 'scenecraft_description_updated',
      shortDescription: 'scenecraft_short_desc_updated',
      category: 'text', // Can be used for detailed text prompts for image/video AIs
      components: [
        { id: 'scene_setting', label: 'scenecraft_scene_setting_label', example: 'scenecraft_scene_setting_example', tooltip: 'scenecraft_scene_setting_tooltip' },
        { id: 'characters_present', label: 'scenecraft_characters_present_label', example: 'scenecraft_characters_present_example', tooltip: 'scenecraft_characters_present_tooltip' },
        { id: 'key_actions_events', label: 'scenecraft_key_actions_events_label', example: 'scenecraft_key_actions_events_example', tooltip: 'scenecraft_key_actions_events_tooltip' },
        { id: 'camera_angle_shot', label: 'scenecraft_camera_angle_shot_label', example: 'scenecraft_camera_angle_shot_example', tooltip: 'scenecraft_camera_angle_shot_tooltip' },
        { id: 'mood_lighting', label: 'scenecraft_mood_lighting_label', example: 'scenecraft_mood_lighting_example', tooltip: 'scenecraft_mood_lighting_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(), // Good for generating text to then paste into image/video tools
    },
    enLocale: {
      name: 'scenecraft_name',
      shortName: 'scenecraft_shortName',
      description: 'scenecraft_description_updated',
      shortDescription: 'scenecraft_short_desc_updated',
      category: 'text',
      components: [
        { id: 'scene_setting', label: 'scenecraft_scene_setting_label', example: 'scenecraft_scene_setting_example', tooltip: 'scenecraft_scene_setting_tooltip' },
        { id: 'characters_present', label: 'scenecraft_characters_present_label', example: 'scenecraft_characters_present_example', tooltip: 'scenecraft_characters_present_tooltip' },
        { id: 'key_actions_events', label: 'scenecraft_key_actions_events_label', example: 'scenecraft_key_actions_events_example', tooltip: 'scenecraft_key_actions_events_tooltip' },
        { id: 'camera_angle_shot', label: 'scenecraft_camera_angle_shot_label', example: 'scenecraft_camera_angle_shot_example', tooltip: 'scenecraft_camera_angle_shot_tooltip' },
        { id: 'mood_lighting', label: 'scenecraft_mood_lighting_label', example: 'scenecraft_mood_lighting_example', tooltip: 'scenecraft_mood_lighting_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },

  // --- Image/Video Frameworks ---
  {
    id: 'midjourney',
    idLocale: {
        name: 'midjourney_name',
        shortName: 'midjourney_shortName',
        description: 'midjourney_description_updated',
        shortDescription: 'midjourney_short_desc_updated',
        category: 'media',
        toolLink: 'https://www.midjourney.com/',
        components: [
            { id: 'main_prompt_mj', label: 'midjourney_comp_main_prompt_label', example: 'midjourney_comp_main_prompt_example_updated', tooltip: 'midjourney_main_prompt_tooltip_updated' },
            { id: 'aspect_ratio_mj', label: 'midjourney_comp_aspect_ratio_label', example: 'midjourney_comp_aspect_ratio_example_updated', tooltip: 'midjourney_aspect_ratio_tooltip_updated' },
            { id: 'version_mj', label: 'midjourney_comp_version_label', example: 'midjourney_comp_version_example_updated', tooltip: 'midjourney_version_tooltip_updated' },
            { id: 'stylize_mj', label: 'midjourney_comp_stylize_label', example: 'midjourney_comp_stylize_example_updated', tooltip: 'midjourney_stylize_tooltip_updated' },
            { id: 'chaos_mj', label: 'midjourney_comp_chaos_label', example: 'midjourney_comp_chaos_example_updated', tooltip: 'midjourney_chaos_tooltip_updated' },
            { id: 'weird_mj', label: 'midjourney_comp_weird_label', example: 'midjourney_comp_weird_example_updated', tooltip: 'midjourney_weird_tooltip_updated' },
            { id: 'tile_mj', label: 'midjourney_comp_tile_label', example: 'midjourney_comp_tile_example_updated', tooltip: 'midjourney_tile_tooltip_updated' },
            { id: 'image_weight_mj', label: 'midjourney_comp_image_weight_label', example: 'midjourney_comp_image_weight_example_updated', tooltip: 'midjourney_image_weight_tooltip_updated' },
            { id: 'style_raw_mj', label: 'midjourney_comp_style_raw_label', example: 'midjourney_comp_style_raw_example_updated', tooltip: 'midjourney_style_raw_tooltip_updated' },
            { id: 'negative_prompt_mj', label: 'midjourney_comp_negative_prompt_label', example: 'midjourney_comp_negative_prompt_example_updated', tooltip: 'midjourney_negative_prompt_tooltip_updated' },
            { id: 'sref_mj', label: 'midjourney_comp_sref_label', example: 'midjourney_comp_sref_example_updated', tooltip: 'midjourney_sref_tooltip_updated' },
            { id: 'other_parameters_mj', label: 'midjourney_comp_other_params_label', example: 'midjourney_comp_other_params_example_updated', tooltip: 'midjourney_other_params_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('midjourney_shortName', 'https://www.midjourney.com/', standardImageVideoAlternatives, 'id'),
        predefinedOptions: {
          'aspect_ratio_mj': ['--ar 1:1', '--ar 16:9', '--ar 9:16', '--ar 4:3', '--ar 3:4', '--ar 3:2', '--ar 2:3', '--ar 2:1', '--ar 1:2', '--ar 4:5', '--ar 5:4', '--ar 7:4', '--ar 4:7'],
          'version_mj': ['--v 6', '--v 5.2', '--v 5.1', '--v 5', '--niji 6', '--niji 5'],
          'tile_mj': ['--tile'],
          'style_raw_mj': ['--style raw'],
        }
    },
    enLocale: {
        name: 'midjourney_name',
        shortName: 'midjourney_shortName',
        description: 'midjourney_description_updated',
        shortDescription: 'midjourney_short_desc_updated',
        category: 'media',
        toolLink: 'https://www.midjourney.com/',
        components: [
            { id: 'main_prompt_mj', label: 'midjourney_comp_main_prompt_label', example: 'midjourney_comp_main_prompt_example_updated', tooltip: 'midjourney_main_prompt_tooltip_updated' },
            { id: 'aspect_ratio_mj', label: 'midjourney_comp_aspect_ratio_label', example: 'midjourney_comp_aspect_ratio_example_updated', tooltip: 'midjourney_aspect_ratio_tooltip_updated' },
            { id: 'version_mj', label: 'midjourney_comp_version_label', example: 'midjourney_comp_version_example_updated', tooltip: 'midjourney_version_tooltip_updated' },
            { id: 'stylize_mj', label: 'midjourney_comp_stylize_label', example: 'midjourney_comp_stylize_example_updated', tooltip: 'midjourney_stylize_tooltip_updated' },
            { id: 'chaos_mj', label: 'midjourney_comp_chaos_label', example: 'midjourney_comp_chaos_example_updated', tooltip: 'midjourney_chaos_tooltip_updated' },
            { id: 'weird_mj', label: 'midjourney_comp_weird_label', example: 'midjourney_comp_weird_example_updated', tooltip: 'midjourney_weird_tooltip_updated' },
            { id: 'tile_mj', label: 'midjourney_comp_tile_label', example: 'midjourney_comp_tile_example_updated', tooltip: 'midjourney_tile_tooltip_updated' },
            { id: 'image_weight_mj', label: 'midjourney_comp_image_weight_label', example: 'midjourney_comp_image_weight_example_updated', tooltip: 'midjourney_image_weight_tooltip_updated' },
            { id: 'style_raw_mj', label: 'midjourney_comp_style_raw_label', example: 'midjourney_comp_style_raw_example_updated', tooltip: 'midjourney_style_raw_tooltip_updated' },
            { id: 'negative_prompt_mj', label: 'midjourney_comp_negative_prompt_label', example: 'midjourney_comp_negative_prompt_example_updated', tooltip: 'midjourney_negative_prompt_tooltip_updated' },
            { id: 'sref_mj', label: 'midjourney_comp_sref_label', example: 'midjourney_comp_sref_example_updated', tooltip: 'midjourney_sref_tooltip_updated' },
            { id: 'other_parameters_mj', label: 'midjourney_comp_other_params_label', example: 'midjourney_comp_other_params_example_updated', tooltip: 'midjourney_other_params_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('midjourney_shortName', 'https://www.midjourney.com/', standardImageVideoAlternatives, 'en'),
        predefinedOptions: {
          'aspect_ratio_mj': ['--ar 1:1', '--ar 16:9', '--ar 9:16', '--ar 4:3', '--ar 3:4', '--ar 3:2', '--ar 2:3', '--ar 2:1', '--ar 1:2', '--ar 4:5', '--ar 5:4', '--ar 7:4', '--ar 4:7'],
          'version_mj': ['--v 6', '--v 5.2', '--v 5.1', '--v 5', '--niji 6', '--niji 5'],
          'tile_mj': ['--tile'],
          'style_raw_mj': ['--style raw'],
        }
    }
  },
  {
    id: 'dalle3',
    idLocale: {
        name: 'dalle3_name',
        shortName: 'dalle3_shortName',
        description: 'dalle3_description_updated',
        shortDescription: 'dalle3_short_desc_updated',
        category: 'media',
        toolLink: 'https://openai.com/dall-e-3', // Info page, often used via ChatGPT or API
        components: [
            { id: 'detailed_desc_d3', label: 'dalle3_comp_detailed_description_label', example: 'dalle3_comp_detailed_description_example_updated', tooltip: 'dalle3_detailed_description_tooltip_updated' },
            { id: 'style_mood_d3', label: 'dalle3_comp_style_mood_label', example: 'dalle3_comp_style_mood_example_updated', tooltip: 'dalle3_style_mood_tooltip_updated' },
            { id: 'composition_lighting_d3', label: 'dalle3_comp_composition_lighting_label', example: 'dalle3_comp_composition_lighting_example_updated', tooltip: 'dalle3_composition_lighting_tooltip_updated' },
            { id: 'color_palette_d3', label: 'dalle3_comp_color_palette_label', example: 'dalle3_comp_color_palette_example_updated', tooltip: 'dalle3_color_palette_tooltip_updated' },
            { id: 'negative_prompt_d3', label: 'dalle3_comp_negative_prompt_label', example: 'dalle3_comp_negative_prompt_example_updated', tooltip: 'dalle3_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('dalle3_shortName', 'https://chat.openai.com/', standardImageVideoAlternatives, 'id'), // ChatGPT is primary access
    },
    enLocale: {
        name: 'dalle3_name',
        shortName: 'dalle3_shortName',
        description: 'dalle3_description_updated',
        shortDescription: 'dalle3_short_desc_updated',
        category: 'media',
        toolLink: 'https://openai.com/dall-e-3',
        components: [
            { id: 'detailed_desc_d3', label: 'dalle3_comp_detailed_description_label', example: 'dalle3_comp_detailed_description_example_updated', tooltip: 'dalle3_detailed_description_tooltip_updated' },
            { id: 'style_mood_d3', label: 'dalle3_comp_style_mood_label', example: 'dalle3_comp_style_mood_example_updated', tooltip: 'dalle3_style_mood_tooltip_updated' },
            { id: 'composition_lighting_d3', label: 'dalle3_comp_composition_lighting_label', example: 'dalle3_comp_composition_lighting_example_updated', tooltip: 'dalle3_composition_lighting_tooltip_updated' },
            { id: 'color_palette_d3', label: 'dalle3_comp_color_palette_label', example: 'dalle3_comp_color_palette_example_updated', tooltip: 'dalle3_color_palette_tooltip_updated' },
            { id: 'negative_prompt_d3', label: 'dalle3_comp_negative_prompt_label', example: 'dalle3_comp_negative_prompt_example_updated', tooltip: 'dalle3_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('dalle3_shortName', 'https://chat.openai.com/', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'stable-diffusion',
    idLocale: {
        name: 'stableDiffusion_name',
        shortName: 'stableDiffusion_shortName',
        description: 'stableDiffusion_description_updated',
        shortDescription: 'stableDiffusion_short_desc_updated',
        category: 'media',
        toolLink: 'https://stablediffusion.com/', // Main info, many UIs exist
        components: [
            { id: 'positive_prompt_sd', label: 'stableDiffusion_comp_positive_prompt_label', example: 'stableDiffusion_comp_positive_prompt_example_updated', tooltip: 'stableDiffusion_positive_prompt_tooltip_updated' },
            { id: 'negative_prompt_sd', label: 'stableDiffusion_comp_negative_prompt_label', example: 'stableDiffusion_comp_negative_prompt_example_updated', tooltip: 'stableDiffusion_negative_prompt_tooltip_updated' },
            { id: 'technical_params_sd', label: 'stableDiffusion_comp_technical_params_label', example: 'stableDiffusion_comp_technical_params_example_updated', tooltip: 'stableDiffusion_technical_params_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('stableDiffusion_shortName', 'https://clipdrop.co/stable-diffusion', standardImageVideoAlternatives, 'id'), // Example UI
    },
    enLocale: {
        name: 'stableDiffusion_name',
        shortName: 'stableDiffusion_shortName',
        description: 'stableDiffusion_description_updated',
        shortDescription: 'stableDiffusion_short_desc_updated',
        category: 'media',
        toolLink: 'https://stablediffusion.com/',
        components: [
            { id: 'positive_prompt_sd', label: 'stableDiffusion_comp_positive_prompt_label', example: 'stableDiffusion_comp_positive_prompt_example_updated', tooltip: 'stableDiffusion_positive_prompt_tooltip_updated' },
            { id: 'negative_prompt_sd', label: 'stableDiffusion_comp_negative_prompt_label', example: 'stableDiffusion_comp_negative_prompt_example_updated', tooltip: 'stableDiffusion_negative_prompt_tooltip_updated' },
            { id: 'technical_params_sd', label: 'stableDiffusion_comp_technical_params_label', example: 'stableDiffusion_comp_technical_params_example_updated', tooltip: 'stableDiffusion_technical_params_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('stableDiffusion_shortName', 'https://clipdrop.co/stable-diffusion', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'leonardo-ai',
    idLocale: {
        name: 'leonardo_name',
        shortName: 'leonardo_shortName',
        description: 'leonardo_description_updated',
        shortDescription: 'leonardo_short_desc_updated',
        category: 'media',
        toolLink: 'https://leonardo.ai/',
        components: [
            { id: 'main_content_leo', label: 'leonardo_comp_main_content_label', example: 'leonardo_comp_main_content_example_updated', tooltip: 'leonardo_main_content_tooltip_updated' },
            { id: 'style_details_leo', label: 'leonardo_comp_style_details_label', example: 'leonardo_comp_style_details_example_updated', tooltip: 'leonardo_style_details_tooltip_updated' },
            { id: 'parameters_leo', label: 'leonardo_comp_parameters_label', example: 'leonardo_comp_parameters_example_updated', tooltip: 'leonardo_parameters_tooltip_updated' },
            { id: 'negative_prompt_leo', label: 'leonardo_comp_negative_prompt_label', example: 'leonardo_comp_negative_prompt_example_updated', tooltip: 'leonardo_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('leonardo_shortName', 'https://app.leonardo.ai/', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'leonardo_name',
        shortName: 'leonardo_shortName',
        description: 'leonardo_description_updated',
        shortDescription: 'leonardo_short_desc_updated',
        category: 'media',
        toolLink: 'https://leonardo.ai/',
        components: [
            { id: 'main_content_leo', label: 'leonardo_comp_main_content_label', example: 'leonardo_comp_main_content_example_updated', tooltip: 'leonardo_main_content_tooltip_updated' },
            { id: 'style_details_leo', label: 'leonardo_comp_style_details_label', example: 'leonardo_comp_style_details_example_updated', tooltip: 'leonardo_style_details_tooltip_updated' },
            { id: 'parameters_leo', label: 'leonardo_comp_parameters_label', example: 'leonardo_comp_parameters_example_updated', tooltip: 'leonardo_parameters_tooltip_updated' },
            { id: 'negative_prompt_leo', label: 'leonardo_comp_negative_prompt_label', example: 'leonardo_comp_negative_prompt_example_updated', tooltip: 'leonardo_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('leonardo_shortName', 'https://app.leonardo.ai/', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'adobe-firefly',
    idLocale: {
        name: 'firefly_name',
        shortName: 'firefly_shortName',
        description: 'firefly_description_updated',
        shortDescription: 'firefly_short_desc_updated',
        category: 'media',
        toolLink: 'https://firefly.adobe.com/',
        components: [
            { id: 'content_desc_firefly', label: 'firefly_comp_content_description_label', example: 'firefly_comp_content_description_example_updated', tooltip: 'firefly_content_description_tooltip_updated' },
            { id: 'style_effects_firefly', label: 'firefly_comp_style_effects_label', example: 'firefly_comp_style_effects_example_updated', tooltip: 'firefly_style_effects_tooltip_updated' },
            { id: 'color_lighting_firefly', label: 'firefly_comp_color_lighting_label', example: 'firefly_comp_color_lighting_example_updated', tooltip: 'firefly_color_lighting_tooltip_updated' },
            { id: 'composition_firefly', label: 'firefly_comp_composition_label', example: 'firefly_comp_composition_example_updated', tooltip: 'firefly_composition_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('firefly_shortName', 'https://firefly.adobe.com/', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'firefly_name',
        shortName: 'firefly_shortName',
        description: 'firefly_description_updated',
        shortDescription: 'firefly_short_desc_updated',
        category: 'media',
        toolLink: 'https://firefly.adobe.com/',
        components: [
            { id: 'content_desc_firefly', label: 'firefly_comp_content_description_label', example: 'firefly_comp_content_description_example_updated', tooltip: 'firefly_content_description_tooltip_updated' },
            { id: 'style_effects_firefly', label: 'firefly_comp_style_effects_label', example: 'firefly_comp_style_effects_example_updated', tooltip: 'firefly_style_effects_tooltip_updated' },
            { id: 'color_lighting_firefly', label: 'firefly_comp_color_lighting_label', example: 'firefly_comp_color_lighting_example_updated', tooltip: 'firefly_color_lighting_tooltip_updated' },
            { id: 'composition_firefly', label: 'firefly_comp_composition_label', example: 'firefly_comp_composition_example_updated', tooltip: 'firefly_composition_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('firefly_shortName', 'https://firefly.adobe.com/', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'ideogram',
    idLocale: {
        name: 'ideogram_name',
        shortName: 'ideogram_shortName',
        description: 'ideogram_description_updated',
        shortDescription: 'ideogram_short_desc_updated',
        category: 'media',
        toolLink: 'https://ideogram.ai/',
        components: [
            { id: 'visual_concept_ideo', label: 'ideogram_comp_visual_concept_label', example: 'ideogram_comp_visual_concept_example_updated', tooltip: 'ideogram_visual_concept_tooltip_updated' },
            { id: 'text_elements_ideo', label: 'ideogram_comp_text_elements_label', example: 'ideogram_comp_text_elements_example_updated', tooltip: 'ideogram_text_elements_tooltip_updated' },
            { id: 'style_modifiers_ideo', label: 'ideogram_comp_style_modifiers_label', example: 'ideogram_comp_style_modifiers_example_updated', tooltip: 'ideogram_style_modifiers_tooltip_updated' },
            { id: 'technical_params_ideo', label: 'ideogram_comp_technical_params_label', example: 'ideogram_comp_technical_params_example_updated', tooltip: 'ideogram_technical_params_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('ideogram_shortName', 'https://ideogram.ai/', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'ideogram_name',
        shortName: 'ideogram_shortName',
        description: 'ideogram_description_updated',
        shortDescription: 'ideogram_short_desc_updated',
        category: 'media',
        toolLink: 'https://ideogram.ai/',
        components: [
            { id: 'visual_concept_ideo', label: 'ideogram_comp_visual_concept_label', example: 'ideogram_comp_visual_concept_example_updated', tooltip: 'ideogram_visual_concept_tooltip_updated' },
            { id: 'text_elements_ideo', label: 'ideogram_comp_text_elements_label', example: 'ideogram_comp_text_elements_example_updated', tooltip: 'ideogram_text_elements_tooltip_updated' },
            { id: 'style_modifiers_ideo', label: 'ideogram_comp_style_modifiers_label', example: 'ideogram_comp_style_modifiers_example_updated', tooltip: 'ideogram_style_modifiers_tooltip_updated' },
            { id: 'technical_params_ideo', label: 'ideogram_comp_technical_params_label', example: 'ideogram_comp_technical_params_example_updated', tooltip: 'ideogram_technical_params_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('ideogram_shortName', 'https://ideogram.ai/', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'runway-gen2',
    idLocale: {
        name: 'runway_name',
        shortName: 'runway_shortName',
        description: 'runway_description_updated',
        shortDescription: 'runway_short_desc_updated',
        category: 'media', // Video
        toolLink: 'https://runwayml.com/',
        components: [
            { id: 'scene_desc_runway', label: 'runway_comp_scene_description_label', example: 'runway_comp_scene_description_example_updated', tooltip: 'runway_scene_description_tooltip_updated' },
            { id: 'actions_move_runway', label: 'runway_comp_actions_movements_label', example: 'runway_comp_actions_movements_example_updated', tooltip: 'runway_actions_movements_tooltip_updated' },
            { id: 'visual_style_runway', label: 'runway_comp_visual_style_label', example: 'runway_comp_visual_style_example_updated', tooltip: 'runway_visual_style_tooltip_updated' },
            { id: 'audio_elements_runway', label: 'runway_comp_audio_elements_label', example: 'runway_comp_audio_elements_example_updated', tooltip: 'runway_audio_elements_tooltip_updated' },
            { id: 'dialogue_runway', label: 'runway_comp_dialogue_label', example: 'runway_comp_dialogue_example_updated', tooltip: 'runway_dialogue_tooltip_updated' },
            { id: 'voice_over_runway', label: 'runway_comp_voice_over_label', example: 'runway_comp_voice_over_example_updated', tooltip: 'runway_voice_over_tooltip_updated' },
            { id: 'tech_params_runway', label: 'runway_comp_technical_params_label', example: 'runway_comp_technical_params_example_updated', tooltip: 'runway_technical_params_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('runway_shortName', 'https://app.runwayml.com/creation', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'runway_name',
        shortName: 'runway_shortName',
        description: 'runway_description_updated',
        shortDescription: 'runway_short_desc_updated',
        category: 'media',
        toolLink: 'https://runwayml.com/',
        components: [
            { id: 'scene_desc_runway', label: 'runway_comp_scene_description_label', example: 'runway_comp_scene_description_example_updated', tooltip: 'runway_scene_description_tooltip_updated' },
            { id: 'actions_move_runway', label: 'runway_comp_actions_movements_label', example: 'runway_comp_actions_movements_example_updated', tooltip: 'runway_actions_movements_tooltip_updated' },
            { id: 'visual_style_runway', label: 'runway_comp_visual_style_label', example: 'runway_comp_visual_style_example_updated', tooltip: 'runway_visual_style_tooltip_updated' },
            { id: 'audio_elements_runway', label: 'runway_comp_audio_elements_label', example: 'runway_comp_audio_elements_example_updated', tooltip: 'runway_audio_elements_tooltip_updated' },
            { id: 'dialogue_runway', label: 'runway_comp_dialogue_label', example: 'runway_comp_dialogue_example_updated', tooltip: 'runway_dialogue_tooltip_updated' },
            { id: 'voice_over_runway', label: 'runway_comp_voice_over_label', example: 'runway_comp_voice_over_example_updated', tooltip: 'runway_voice_over_tooltip_updated' },
            { id: 'tech_params_runway', label: 'runway_comp_technical_params_label', example: 'runway_comp_technical_params_example_updated', tooltip: 'runway_technical_params_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('runway_shortName', 'https://app.runwayml.com/creation', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'pika-labs',
    idLocale: {
        name: 'pika_name',
        shortName: 'pika_shortName',
        description: 'pika_description_updated',
        shortDescription: 'pika_short_desc_updated',
        category: 'media', // Video
        toolLink: 'https://pika.art/',
        components: [
            { id: 'scene_elements_pika', label: 'pika_comp_scene_elements_label', example: 'pika_comp_scene_elements_example_updated', tooltip: 'pika_scene_elements_tooltip_updated' },
            { id: 'motion_style_pika', label: 'pika_comp_motion_style_label', example: 'pika_comp_motion_style_example_updated', tooltip: 'pika_motion_style_tooltip_updated' },
            { id: 'audio_design_pika', label: 'pika_comp_audio_design_label', example: 'pika_comp_audio_design_example_updated', tooltip: 'pika_audio_design_tooltip_updated' },
            { id: 'dialogue_pika', label: 'pika_comp_dialogue_label', example: 'pika_comp_dialogue_example_updated', tooltip: 'pika_dialogue_tooltip_updated' },
            { id: 'voice_over_pika', label: 'pika_comp_voice_over_label', example: 'pika_comp_voice_over_example_updated', tooltip: 'pika_voice_over_tooltip_updated' },
            { id: 'camera_params_pika', label: 'pika_comp_camera_params_label', example: 'pika_comp_camera_params_example_updated', tooltip: 'pika_camera_params_tooltip_updated' },
            { id: 'negative_prompt_pika', label: 'pika_comp_negative_prompt_label', example: 'pika_comp_negative_prompt_example_updated', tooltip: 'pika_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('pika_shortName', 'https://pika.art/', standardImageVideoAlternatives, 'id'),
        predefinedOptions: {
            'camera_params_pika': ['-camera zoom in', '-camera zoom out', '-camera pan left', '-camera pan right', '-camera pan up', '-camera pan down', '-ar 16:9', '-ar 9:16', '-ar 1:1'],
        }
    },
    enLocale: {
        name: 'pika_name',
        shortName: 'pika_shortName',
        description: 'pika_description_updated',
        shortDescription: 'pika_short_desc_updated',
        category: 'media',
        toolLink: 'https://pika.art/',
        components: [
            { id: 'scene_elements_pika', label: 'pika_comp_scene_elements_label', example: 'pika_comp_scene_elements_example_updated', tooltip: 'pika_scene_elements_tooltip_updated' },
            { id: 'motion_style_pika', label: 'pika_comp_motion_style_label', example: 'pika_comp_motion_style_example_updated', tooltip: 'pika_motion_style_tooltip_updated' },
            { id: 'audio_design_pika', label: 'pika_comp_audio_design_label', example: 'pika_comp_audio_design_example_updated', tooltip: 'pika_audio_design_tooltip_updated' },
            { id: 'dialogue_pika', label: 'pika_comp_dialogue_label', example: 'pika_comp_dialogue_example_updated', tooltip: 'pika_dialogue_tooltip_updated' },
            { id: 'voice_over_pika', label: 'pika_comp_voice_over_label', example: 'pika_comp_voice_over_example_updated', tooltip: 'pika_voice_over_tooltip_updated' },
            { id: 'camera_params_pika', label: 'pika_comp_camera_params_label', example: 'pika_comp_camera_params_example_updated', tooltip: 'pika_camera_params_tooltip_updated' },
            { id: 'negative_prompt_pika', label: 'pika_comp_negative_prompt_label', example: 'pika_comp_negative_prompt_example_updated', tooltip: 'pika_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('pika_shortName', 'https://pika.art/', standardImageVideoAlternatives, 'en'),
        predefinedOptions: {
            'camera_params_pika': ['-camera zoom in', '-camera zoom out', '-camera pan left', '-camera pan right', '-camera pan up', '-camera pan down', '-ar 16:9', '-ar 9:16', '-ar 1:1'],
        }
    }
  },
  {
    id: 'openai-sora',
    idLocale: {
        name: 'sora_name',
        shortName: 'sora_shortName',
        description: 'sora_description_updated',
        shortDescription: 'sora_short_desc_updated',
        category: 'media', // Video
        toolLink: 'https://openai.com/sora', // Info page
        components: [
            { id: 'narrative_sora', label: 'sora_comp_narrative_concept_label', example: 'sora_comp_narrative_concept_example_updated', tooltip: 'sora_narrative_concept_tooltip_updated' },
            { id: 'visual_style_sora', label: 'sora_comp_visual_cinematic_label', example: 'sora_comp_visual_cinematic_example_updated', tooltip: 'sora_visual_cinematic_tooltip_updated' },
            { id: 'character_details_sora', label: 'sora_comp_character_details_label', example: 'sora_comp_character_details_example_updated', tooltip: 'sora_character_details_tooltip_updated' },
            { id: 'sound_atmosphere_sora', label: 'sora_comp_sound_atmosphere_label', example: 'sora_comp_sound_atmosphere_example_updated', tooltip: 'sora_sound_atmosphere_tooltip_updated' },
            { id: 'dialogue_sora', label: 'sora_comp_dialogue_label', example: 'sora_comp_dialogue_example_updated', tooltip: 'sora_dialogue_tooltip_updated' },
            { id: 'voice_over_sora', label: 'sora_comp_voice_over_label', example: 'sora_comp_voice_over_example_updated', tooltip: 'sora_voice_over_tooltip_updated' },
            { id: 'tech_fidelity_sora', label: 'sora_comp_technical_fidelity_label', example: 'sora_comp_technical_fidelity_example_updated', tooltip: 'sora_technical_fidelity_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('sora_shortName', 'https://openai.com/sora', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'sora_name',
        shortName: 'sora_shortName',
        description: 'sora_description_updated',
        shortDescription: 'sora_short_desc_updated',
        category: 'media',
        toolLink: 'https://openai.com/sora',
        components: [
            { id: 'narrative_sora', label: 'sora_comp_narrative_concept_label', example: 'sora_comp_narrative_concept_example_updated', tooltip: 'sora_narrative_concept_tooltip_updated' },
            { id: 'visual_style_sora', label: 'sora_comp_visual_cinematic_label', example: 'sora_comp_visual_cinematic_example_updated', tooltip: 'sora_visual_cinematic_tooltip_updated' },
            { id: 'character_details_sora', label: 'sora_comp_character_details_label', example: 'sora_comp_character_details_example_updated', tooltip: 'sora_character_details_tooltip_updated' },
            { id: 'sound_atmosphere_sora', label: 'sora_comp_sound_atmosphere_label', example: 'sora_comp_sound_atmosphere_example_updated', tooltip: 'sora_sound_atmosphere_tooltip_updated' },
            { id: 'dialogue_sora', label: 'sora_comp_dialogue_label', example: 'sora_comp_dialogue_example_updated', tooltip: 'sora_dialogue_tooltip_updated' },
            { id: 'voice_over_sora', label: 'sora_comp_voice_over_label', example: 'sora_comp_voice_over_example_updated', tooltip: 'sora_voice_over_tooltip_updated' },
            { id: 'tech_fidelity_sora', label: 'sora_comp_technical_fidelity_label', example: 'sora_comp_technical_fidelity_example_updated', tooltip: 'sora_technical_fidelity_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('sora_shortName', 'https://openai.com/sora', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'google-veo',
    idLocale: {
        name: 'veo_name',
        shortName: 'veo_shortName',
        description: 'veo_description_updated',
        shortDescription: 'veo_short_desc_updated',
        category: 'media', // Video
        toolLink: 'https://deepmind.google/technologies/veo/', // Info page
        components: [
            { id: 'core_concept_veo', label: 'veo_comp_core_concept_label', example: 'veo_comp_core_concept_example_updated', tooltip: 'veo_core_concept_tooltip_updated' },
            { id: 'visual_style_veo', label: 'veo_comp_visual_style_label', example: 'veo_comp_visual_style_example_updated', tooltip: 'veo_visual_style_tooltip_updated' },
            { id: 'cinematography_veo', label: 'veo_comp_cinematography_label', example: 'veo_comp_cinematography_example_updated', tooltip: 'veo_cinematography_tooltip_updated' },
            { id: 'sound_design_veo', label: 'veo_comp_sound_design_label', example: 'veo_comp_sound_design_example_updated', tooltip: 'veo_sound_design_tooltip_updated' },
            { id: 'dialogue_veo', label: 'veo_comp_dialogue_label', example: 'veo_comp_dialogue_example_updated', tooltip: 'veo_dialogue_tooltip_updated' },
            { id: 'voice_over_veo', label: 'veo_comp_voice_over_label', example: 'veo_comp_voice_over_example_updated', tooltip: 'veo_voice_over_tooltip_updated' },
            { id: 'negative_prompt_veo', label: 'veo_comp_negative_prompt_label', example: 'veo_comp_negative_prompt_example_updated', tooltip: 'veo_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('veo_shortName', 'https://deepmind.google/technologies/veo/', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'veo_name',
        shortName: 'veo_shortName',
        description: 'veo_description_updated',
        shortDescription: 'veo_short_desc_updated',
        category: 'media',
        toolLink: 'https://deepmind.google/technologies/veo/',
        components: [
            { id: 'core_concept_veo', label: 'veo_comp_core_concept_label', example: 'veo_comp_core_concept_example_updated', tooltip: 'veo_core_concept_tooltip_updated' },
            { id: 'visual_style_veo', label: 'veo_comp_visual_style_label', example: 'veo_comp_visual_style_example_updated', tooltip: 'veo_visual_style_tooltip_updated' },
            { id: 'cinematography_veo', label: 'veo_comp_cinematography_label', example: 'veo_comp_cinematography_example_updated', tooltip: 'veo_cinematography_tooltip_updated' },
            { id: 'sound_design_veo', label: 'veo_comp_sound_design_label', example: 'veo_comp_sound_design_example_updated', tooltip: 'veo_sound_design_tooltip_updated' },
            { id: 'dialogue_veo', label: 'veo_comp_dialogue_label', example: 'veo_comp_dialogue_example_updated', tooltip: 'veo_dialogue_tooltip_updated' },
            { id: 'voice_over_veo', label: 'veo_comp_voice_over_label', example: 'veo_comp_voice_over_example_updated', tooltip: 'veo_voice_over_tooltip_updated' },
            { id: 'negative_prompt_veo', label: 'veo_comp_negative_prompt_label', example: 'veo_comp_negative_prompt_example_updated', tooltip: 'veo_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('veo_shortName', 'https://deepmind.google/technologies/veo/', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'playground-ai',
    idLocale: {
        name: 'playground_name',
        shortName: 'playground_shortName',
        description: 'playground_description_updated',
        shortDescription: 'playground_short_desc_updated',
        category: 'media', // Image
        toolLink: 'https://playground.com/',
        components: [
            { id: 'subject_scene_playground', label: 'playground_comp_subject_scene_label', example: 'playground_comp_subject_scene_example_updated', tooltip: 'playground_subject_scene_tooltip_updated' },
            { id: 'style_filters_playground', label: 'playground_comp_style_filters_label', example: 'playground_comp_style_filters_example_updated', tooltip: 'playground_style_filters_tooltip_updated' },
            { id: 'composition_params_playground', label: 'playground_comp_composition_params_label', example: 'playground_comp_composition_params_example_updated', tooltip: 'playground_composition_params_tooltip_updated' },
            { id: 'negative_prompt_playground', label: 'playground_comp_negative_prompt_label', example: 'playground_comp_negative_prompt_example_updated', tooltip: 'playground_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('playground_shortName', 'https://playground.com/', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'playground_name',
        shortName: 'playground_shortName',
        description: 'playground_description_updated',
        shortDescription: 'playground_short_desc_updated',
        category: 'media',
        toolLink: 'https://playground.com/',
        components: [
            { id: 'subject_scene_playground', label: 'playground_comp_subject_scene_label', example: 'playground_comp_subject_scene_example_updated', tooltip: 'playground_subject_scene_tooltip_updated' },
            { id: 'style_filters_playground', label: 'playground_comp_style_filters_label', example: 'playground_comp_style_filters_example_updated', tooltip: 'playground_style_filters_tooltip_updated' },
            { id: 'composition_params_playground', label: 'playground_comp_composition_params_label', example: 'playground_comp_composition_params_example_updated', tooltip: 'playground_composition_params_tooltip_updated' },
            { id: 'negative_prompt_playground', label: 'playground_comp_negative_prompt_label', example: 'playground_comp_negative_prompt_example_updated', tooltip: 'playground_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('playground_shortName', 'https://playground.com/', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'canva-magic-media',
    idLocale: {
        name: 'canva_name',
        shortName: 'canva_shortName',
        description: 'canva_description_updated',
        shortDescription: 'canva_short_desc_updated',
        category: 'media', // Image & Video
        toolLink: 'https://www.canva.com/ai-image-generator/',
        components: [
            { id: 'design_elements_canva', label: 'canva_comp_design_elements_label', example: 'canva_comp_design_elements_example_updated', tooltip: 'canva_design_elements_tooltip_updated' },
            { id: 'visual_theme_canva', label: 'canva_comp_visual_theme_label', example: 'canva_comp_visual_theme_example_updated', tooltip: 'canva_visual_theme_tooltip_updated' },
            { id: 'style_composition_canva', label: 'canva_comp_style_composition_label', example: 'canva_comp_style_composition_example_updated', tooltip: 'canva_style_composition_tooltip_updated' },
            { id: 'additional_keywords_canva', label: 'canva_comp_additional_keywords_label', example: 'canva_comp_additional_keywords_example_updated', tooltip: 'canva_additional_keywords_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('canva_shortName', 'https://www.canva.com/ai-image-generator/', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'canva_name',
        shortName: 'canva_shortName',
        description: 'canva_description_updated',
        shortDescription: 'canva_short_desc_updated',
        category: 'media',
        toolLink: 'https://www.canva.com/ai-image-generator/',
        components: [
            { id: 'design_elements_canva', label: 'canva_comp_design_elements_label', example: 'canva_comp_design_elements_example_updated', tooltip: 'canva_design_elements_tooltip_updated' },
            { id: 'visual_theme_canva', label: 'canva_comp_visual_theme_label', example: 'canva_comp_visual_theme_example_updated', tooltip: 'canva_visual_theme_tooltip_updated' },
            { id: 'style_composition_canva', label: 'canva_comp_style_composition_label', example: 'canva_comp_style_composition_example_updated', tooltip: 'canva_style_composition_tooltip_updated' },
            { id: 'additional_keywords_canva', label: 'canva_comp_additional_keywords_label', example: 'canva_comp_additional_keywords_example_updated', tooltip: 'canva_additional_keywords_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('canva_shortName', 'https://www.canva.com/ai-image-generator/', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'kaiber-ai',
    idLocale: {
        name: 'kaiber_name',
        shortName: 'kaiber_shortName',
        description: 'kaiber_description_updated',
        shortDescription: 'kaiber_short_desc_updated',
        category: 'media', // Animation/Video
        toolLink: 'https://kaiber.ai/',
        components: [
            { id: 'initial_concept_kaiber', label: 'kaiber_comp_initial_concept_label', example: 'kaiber_comp_initial_concept_example_updated', tooltip: 'kaiber_initial_concept_tooltip_updated' },
            { id: 'visual_style_kaiber', label: 'kaiber_comp_visual_style_label', example: 'kaiber_comp_visual_style_example_updated', tooltip: 'kaiber_visual_style_tooltip_updated' },
            { id: 'motion_transform_kaiber', label: 'kaiber_comp_motion_transformation_label', example: 'kaiber_comp_motion_transformation_example_updated', tooltip: 'kaiber_motion_transformation_tooltip_updated' },
            { id: 'audio_sync_kaiber', label: 'kaiber_comp_audio_sync_label', example: 'kaiber_comp_audio_sync_example_updated', tooltip: 'kaiber_audio_sync_tooltip_updated' },
            { id: 'dialogue_kaiber', label: 'kaiber_comp_dialogue_label', example: 'kaiber_comp_dialogue_example_updated', tooltip: 'kaiber_dialogue_tooltip_updated' },
            { id: 'voice_over_kaiber', label: 'kaiber_comp_voice_over_label', example: 'kaiber_comp_voice_over_example_updated', tooltip: 'kaiber_voice_over_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('kaiber_shortName', 'https://kaiber.ai/', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'kaiber_name',
        shortName: 'kaiber_shortName',
        description: 'kaiber_description_updated',
        shortDescription: 'kaiber_short_desc_updated',
        category: 'media',
        toolLink: 'https://kaiber.ai/',
        components: [
            { id: 'initial_concept_kaiber', label: 'kaiber_comp_initial_concept_label', example: 'kaiber_comp_initial_concept_example_updated', tooltip: 'kaiber_initial_concept_tooltip_updated' },
            { id: 'visual_style_kaiber', label: 'kaiber_comp_visual_style_label', example: 'kaiber_comp_visual_style_example_updated', tooltip: 'kaiber_visual_style_tooltip_updated' },
            { id: 'motion_transform_kaiber', label: 'kaiber_comp_motion_transformation_label', example: 'kaiber_comp_motion_transformation_example_updated', tooltip: 'kaiber_motion_transformation_tooltip_updated' },
            { id: 'audio_sync_kaiber', label: 'kaiber_comp_audio_sync_label', example: 'kaiber_comp_audio_sync_example_updated', tooltip: 'kaiber_audio_sync_tooltip_updated' },
            { id: 'dialogue_kaiber', label: 'kaiber_comp_dialogue_label', example: 'kaiber_comp_dialogue_example_updated', tooltip: 'kaiber_dialogue_tooltip_updated' },
            { id: 'voice_over_kaiber', label: 'kaiber_comp_voice_over_label', example: 'kaiber_comp_voice_over_example_updated', tooltip: 'kaiber_voice_over_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('kaiber_shortName', 'https://kaiber.ai/', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'nightcafe-creator',
    idLocale: {
        name: 'nightcafe_name',
        shortName: 'nightcafe_shortName',
        description: 'nightcafe_description_updated',
        shortDescription: 'nightcafe_short_desc_updated',
        category: 'media', // Image
        toolLink: 'https://creator.nightcafe.studio/',
        components: [
            { id: 'subject_scene_nightcafe', label: 'nightcafe_comp_subject_scene_label', example: 'nightcafe_comp_subject_scene_example_updated', tooltip: 'nightcafe_subject_scene_tooltip_updated' },
            { id: 'artistic_style_nightcafe', label: 'nightcafe_comp_artistic_style_label', example: 'nightcafe_comp_artistic_style_example_updated', tooltip: 'nightcafe_artistic_style_tooltip_updated' },
            { id: 'modifiers_details_nightcafe', label: 'nightcafe_comp_modifiers_details_label', example: 'nightcafe_comp_modifiers_details_example_updated', tooltip: 'nightcafe_modifiers_details_tooltip_updated' },
            { id: 'advanced_options_nightcafe', label: 'nightcafe_comp_advanced_options_label', example: 'nightcafe_comp_advanced_options_example_updated', tooltip: 'nightcafe_advanced_options_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('nightcafe_shortName', 'https://creator.nightcafe.studio/', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'nightcafe_name',
        shortName: 'nightcafe_shortName',
        description: 'nightcafe_description_updated',
        shortDescription: 'nightcafe_short_desc_updated',
        category: 'media',
        toolLink: 'https://creator.nightcafe.studio/',
        components: [
            { id: 'subject_scene_nightcafe', label: 'nightcafe_comp_subject_scene_label', example: 'nightcafe_comp_subject_scene_example_updated', tooltip: 'nightcafe_subject_scene_tooltip_updated' },
            { id: 'artistic_style_nightcafe', label: 'nightcafe_comp_artistic_style_label', example: 'nightcafe_comp_artistic_style_example_updated', tooltip: 'nightcafe_artistic_style_tooltip_updated' },
            { id: 'modifiers_details_nightcafe', label: 'nightcafe_comp_modifiers_details_label', example: 'nightcafe_comp_modifiers_details_example_updated', tooltip: 'nightcafe_modifiers_details_tooltip_updated' },
            { id: 'advanced_options_nightcafe', label: 'nightcafe_comp_advanced_options_label', example: 'nightcafe_comp_advanced_options_example_updated', tooltip: 'nightcafe_advanced_options_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('nightcafe_shortName', 'https://creator.nightcafe.studio/', standardImageVideoAlternatives, 'en'),
    }
  },
  {
    id: 'clipdrop-stability',
    idLocale: {
        name: 'clipdrop_name',
        shortName: 'clipdrop_shortName',
        description: 'clipdrop_description_updated',
        shortDescription: 'clipdrop_short_desc_updated',
        category: 'media', // Image
        toolLink: 'https://clipdrop.co/stable-diffusion',
        components: [
            { id: 'main_content_clipdrop', label: 'clipdrop_comp_main_content_label', example: 'clipdrop_comp_main_content_example_updated', tooltip: 'clipdrop_main_content_tooltip_updated' },
            { id: 'style_modifiers_clipdrop', label: 'clipdrop_comp_style_modifiers_label', example: 'clipdrop_comp_style_modifiers_example_updated', tooltip: 'clipdrop_style_modifiers_tooltip_updated' },
            { id: 'technical_params_clipdrop', label: 'clipdrop_comp_technical_params_label', example: 'clipdrop_comp_technical_params_example_updated', tooltip: 'clipdrop_technical_params_tooltip_updated' },
            { id: 'negative_prompt_clipdrop', label: 'clipdrop_comp_negative_prompt_label', example: 'clipdrop_comp_negative_prompt_example_updated', tooltip: 'clipdrop_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('clipdrop_shortName', 'https://clipdrop.co/stable-diffusion', standardImageVideoAlternatives, 'id'),
    },
    enLocale: {
        name: 'clipdrop_name',
        shortName: 'clipdrop_shortName',
        description: 'clipdrop_description_updated',
        shortDescription: 'clipdrop_short_desc_updated',
        category: 'media',
        toolLink: 'https://clipdrop.co/stable-diffusion',
        components: [
            { id: 'main_content_clipdrop', label: 'clipdrop_comp_main_content_label', example: 'clipdrop_comp_main_content_example_updated', tooltip: 'clipdrop_main_content_tooltip_updated' },
            { id: 'style_modifiers_clipdrop', label: 'clipdrop_comp_style_modifiers_label', example: 'clipdrop_comp_style_modifiers_example_updated', tooltip: 'clipdrop_style_modifiers_tooltip_updated' },
            { id: 'technical_params_clipdrop', label: 'clipdrop_comp_technical_params_label', example: 'clipdrop_comp_technical_params_example_updated', tooltip: 'clipdrop_technical_params_tooltip_updated' },
            { id: 'negative_prompt_clipdrop', label: 'clipdrop_comp_negative_prompt_label', example: 'clipdrop_comp_negative_prompt_example_updated', tooltip: 'clipdrop_negative_prompt_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('clipdrop_shortName', 'https://clipdrop.co/stable-diffusion', standardImageVideoAlternatives, 'en'),
    }
  },
  // --- Music Frameworks ---
  {
    id: 'suno-ai',
    idLocale: {
        name: 'sunoAi_name',
        shortName: 'sunoAi_shortName',
        description: 'sunoAi_description_updated',
        shortDescription: 'sunoAi_short_desc_updated',
        category: 'music',
        toolLink: 'https://suno.com/',
        components: [
            { id: 'genre_suno', label: 'sunoAi_comp_genre_label', example: 'sunoAi_comp_genre_example_updated', tooltip: 'sunoAi_genre_tooltip_updated' },
            { id: 'mood_suno', label: 'sunoAi_comp_mood_label', example: 'sunoAi_comp_mood_example_updated', tooltip: 'sunoAi_mood_tooltip_updated' },
            { id: 'instrumentation_suno', label: 'sunoAi_comp_instrumentation_label', example: 'sunoAi_comp_instrumentation_example_updated', tooltip: 'sunoAi_instrumentation_tooltip_updated' },
            { id: 'vocals_suno', label: 'sunoAi_comp_vocals_label', example: 'sunoAi_comp_vocals_example_updated', tooltip: 'sunoAi_vocals_tooltip_updated' },
            { id: 'tempo_suno', label: 'sunoAi_comp_tempo_label', example: 'sunoAi_comp_tempo_example_updated', tooltip: 'sunoAi_tempo_tooltip_updated' },
            { id: 'structure_suno', label: 'sunoAi_comp_structure_label', example: 'sunoAi_comp_structure_example_updated', tooltip: 'sunoAi_structure_tooltip_updated' },
            { id: 'lyrics_theme_suno', label: 'sunoAi_comp_lyrics_theme_label', example: 'sunoAi_comp_lyrics_theme_example_updated', tooltip: 'sunoAi_lyrics_theme_tooltip_updated' },
            { id: 'custom_lyrics_suno', label: 'sunoAi_comp_custom_lyrics_label', example: 'sunoAi_comp_custom_lyrics_example_updated', tooltip: 'sunoAi_custom_lyrics_tooltip_updated' },
            { id: 'song_type_suno', label: 'sunoAi_comp_song_type_label', example: 'sunoAi_comp_song_type_example_updated', tooltip: 'sunoAi_song_type_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('sunoAi_shortName', 'https://suno.com/', standardMusicAlternatives, 'id'),
    },
    enLocale: {
        name: 'sunoAi_name',
        shortName: 'sunoAi_shortName',
        description: 'sunoAi_description_updated',
        shortDescription: 'sunoAi_short_desc_updated',
        category: 'music',
        toolLink: 'https://suno.com/',
        components: [
            { id: 'genre_suno', label: 'sunoAi_comp_genre_label', example: 'sunoAi_comp_genre_example_updated', tooltip: 'sunoAi_genre_tooltip_updated' },
            { id: 'mood_suno', label: 'sunoAi_comp_mood_label', example: 'sunoAi_comp_mood_example_updated', tooltip: 'sunoAi_mood_tooltip_updated' },
            { id: 'instrumentation_suno', label: 'sunoAi_comp_instrumentation_label', example: 'sunoAi_comp_instrumentation_example_updated', tooltip: 'sunoAi_instrumentation_tooltip_updated' },
            { id: 'vocals_suno', label: 'sunoAi_comp_vocals_label', example: 'sunoAi_comp_vocals_example_updated', tooltip: 'sunoAi_vocals_tooltip_updated' },
            { id: 'tempo_suno', label: 'sunoAi_comp_tempo_label', example: 'sunoAi_comp_tempo_example_updated', tooltip: 'sunoAi_tempo_tooltip_updated' },
            { id: 'structure_suno', label: 'sunoAi_comp_structure_label', example: 'sunoAi_comp_structure_example_updated', tooltip: 'sunoAi_structure_tooltip_updated' },
            { id: 'lyrics_theme_suno', label: 'sunoAi_comp_lyrics_theme_label', example: 'sunoAi_comp_lyrics_theme_example_updated', tooltip: 'sunoAi_lyrics_theme_tooltip_updated' },
            { id: 'custom_lyrics_suno', label: 'sunoAi_comp_custom_lyrics_label', example: 'sunoAi_comp_custom_lyrics_example_updated', tooltip: 'sunoAi_custom_lyrics_tooltip_updated' },
            { id: 'song_type_suno', label: 'sunoAi_comp_song_type_label', example: 'sunoAi_comp_song_type_example_updated', tooltip: 'sunoAi_song_type_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('sunoAi_shortName', 'https://suno.com/', standardMusicAlternatives, 'en'),
    }
  },
  {
    id: 'udio-ai',
    idLocale: {
        name: 'udioAi_name',
        shortName: 'udioAi_shortName',
        description: 'udioAi_description_updated',
        shortDescription: 'udioAi_short_desc_updated',
        category: 'music',
        toolLink: 'https://www.udio.com/',
        components: [
            { id: 'main_prompt_udio', label: 'udioAi_comp_prompt_label', example: 'udioAi_comp_prompt_example_updated', tooltip: 'udioAi_prompt_tooltip_updated' },
            { id: 'lyrics_udio', label: 'udioAi_comp_lyrics_label', example: 'udioAi_comp_lyrics_example_updated', tooltip: 'udioAi_lyrics_tooltip_updated' },
            { id: 'output_purpose_udio', label: 'udioAi_comp_output_purpose_label', example: 'udioAi_comp_output_purpose_example_updated', tooltip: 'udioAi_output_purpose_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('udioAi_shortName', 'https://www.udio.com/', standardMusicAlternatives, 'id'),
    },
    enLocale: {
        name: 'udioAi_name',
        shortName: 'udioAi_shortName',
        description: 'udioAi_description_updated',
        shortDescription: 'udioAi_short_desc_updated',
        category: 'music',
        toolLink: 'https://www.udio.com/',
        components: [
            { id: 'main_prompt_udio', label: 'udioAi_comp_prompt_label', example: 'udioAi_comp_prompt_example_updated', tooltip: 'udioAi_prompt_tooltip_updated' },
            { id: 'lyrics_udio', label: 'udioAi_comp_lyrics_label', example: 'udioAi_comp_lyrics_example_updated', tooltip: 'udioAi_lyrics_tooltip_updated' },
            { id: 'output_purpose_udio', label: 'udioAi_comp_output_purpose_label', example: 'udioAi_comp_output_purpose_example_updated', tooltip: 'udioAi_output_purpose_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('udioAi_shortName', 'https://www.udio.com/', standardMusicAlternatives, 'en'),
    }
  },
  {
    id: 'google-musicfx',
    idLocale: {
        name: 'google_musicfx_name',
        shortName: 'google_musicfx_shortName',
        description: 'google_musicfx_description_updated',
        shortDescription: 'google_musicfx_short_desc_updated',
        category: 'music',
        toolLink: 'https://aitestkitchen.withgoogle.com/tools/music-fx',
        components: [
            { id: 'description_musicfx', label: 'musicfx_comp_description_label', example: 'musicfx_comp_description_example_updated', tooltip: 'musicfx_description_tooltip_updated' },
            { id: 'length_musicfx', label: 'musicfx_comp_length_label', example: 'musicfx_comp_length_example_updated', tooltip: 'musicfx_length_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('google_musicfx_shortName', 'https://aitestkitchen.withgoogle.com/tools/music-fx', standardMusicAlternatives, 'id'),
        predefinedOptions: {
            'length_musicfx': ['30s', '50s', '70s', '1m', '1m30s', '2m'],
        }
    },
    enLocale: {
        name: 'google_musicfx_name',
        shortName: 'google_musicfx_shortName',
        description: 'google_musicfx_description_updated',
        shortDescription: 'google_musicfx_short_desc_updated',
        category: 'music',
        toolLink: 'https://aitestkitchen.withgoogle.com/tools/music-fx',
        components: [
            { id: 'description_musicfx', label: 'musicfx_comp_description_label', example: 'musicfx_comp_description_example_updated', tooltip: 'musicfx_description_tooltip_updated' },
            { id: 'length_musicfx', label: 'musicfx_comp_length_label', example: 'musicfx_comp_length_example_updated', tooltip: 'musicfx_length_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('google_musicfx_shortName', 'https://aitestkitchen.withgoogle.com/tools/music-fx', standardMusicAlternatives, 'en'),
        predefinedOptions: {
            'length_musicfx': ['30s', '50s', '70s', '1m', '1m30s', '2m'],
        }
    }
  },
  {
    id: 'stable-audio',
    idLocale: {
        name: 'stable_audio_name',
        shortName: 'stable_audio_shortName',
        description: 'stable_audio_description_updated',
        shortDescription: 'stable_audio_short_desc_updated',
        category: 'music',
        toolLink: 'https://stableaudio.com/',
        components: [
            { id: 'description_stableaudio', label: 'stableaudio_comp_description_label', example: 'stableaudio_comp_description_example_updated', tooltip: 'stableaudio_description_tooltip_updated' },
            { id: 'length_stableaudio', label: 'stableaudio_comp_length_label', example: 'stableaudio_comp_length_example_updated', tooltip: 'stableaudio_length_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('stable_audio_shortName', 'https://stableaudio.com/', standardMusicAlternatives, 'id'),
    },
    enLocale: {
        name: 'stable_audio_name',
        shortName: 'stable_audio_shortName',
        description: 'stable_audio_description_updated',
        shortDescription: 'stable_audio_short_desc_updated',
        category: 'music',
        toolLink: 'https://stableaudio.com/',
        components: [
            { id: 'description_stableaudio', label: 'stableaudio_comp_description_label', example: 'stableaudio_comp_description_example_updated', tooltip: 'stableaudio_description_tooltip_updated' },
            { id: 'length_stableaudio', label: 'stableaudio_comp_length_label', example: 'stableaudio_comp_length_example_updated', tooltip: 'stableaudio_length_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('stable_audio_shortName', 'https://stableaudio.com/', standardMusicAlternatives, 'en'),
    }
  },
  {
    id: 'mubert-ai',
    idLocale: {
        name: 'mubert_ai_name',
        shortName: 'mubert_ai_shortName',
        description: 'mubert_ai_description_updated',
        shortDescription: 'mubert_ai_short_desc_updated',
        category: 'music',
        toolLink: 'https://mubert.com/render',
        components: [
            { id: 'genre_mood_activity_mubert', label: 'mubert_comp_genre_mood_activity_label', example: 'mubert_comp_genre_mood_activity_example_updated', tooltip: 'mubert_genre_mood_activity_tooltip_updated' },
            { id: 'instruments_tempo_mubert', label: 'mubert_comp_instruments_tempo_label', example: 'mubert_comp_instruments_tempo_example_updated', tooltip: 'mubert_instruments_tempo_tooltip_updated' },
            { id: 'duration_mubert', label: 'mubert_comp_duration_label', example: 'mubert_comp_duration_example_updated', tooltip: 'mubert_duration_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('mubert_ai_shortName', 'https://mubert.com/render', standardMusicAlternatives, 'id'),
        predefinedOptions: {
            'duration_mubert': ['1 min', '2 min', '3 min', '5 min', '10 min', 'loop'],
        }
    },
    enLocale: {
        name: 'mubert_ai_name',
        shortName: 'mubert_ai_shortName',
        description: 'mubert_ai_description_updated',
        shortDescription: 'mubert_ai_short_desc_updated',
        category: 'music',
        toolLink: 'https://mubert.com/render',
        components: [
            { id: 'genre_mood_activity_mubert', label: 'mubert_comp_genre_mood_activity_label', example: 'mubert_comp_genre_mood_activity_example_updated', tooltip: 'mubert_genre_mood_activity_tooltip_updated' },
            { id: 'instruments_tempo_mubert', label: 'mubert_comp_instruments_tempo_label', example: 'mubert_comp_instruments_tempo_example_updated', tooltip: 'mubert_instruments_tempo_tooltip_updated' },
            { id: 'duration_mubert', label: 'mubert_comp_duration_label', example: 'mubert_comp_duration_example_updated', tooltip: 'mubert_duration_tooltip_updated' },
        ],
        genericToolLinks: createMediaMusicToolLinks('mubert_ai_shortName', 'https://mubert.com/render', standardMusicAlternatives, 'en'),
        predefinedOptions: {
            'duration_mubert': ['1 min', '2 min', '3 min', '5 min', '10 min', 'loop'],
        }
    }
  },
];
