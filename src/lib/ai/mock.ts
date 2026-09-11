import type { StudySet } from "@/types/study";

interface MockTopicTemplate {
  keywords: string[];
  title: string;
  summary: string;
  flashcards: Array<{
    front: string;
    back: string;
    hint: string;
    category: string;
  }>;
  quiz: Array<{
    question: string;
    options: [string, string, string, string];
    correctOptionIndex: 0 | 1 | 2 | 3;
    explanation: string;
  }>;
}

const TOPIC_TEMPLATES: MockTopicTemplate[] = [
  {
    keywords: ["neuron", "synapse", "brain", "neuroscience", "memory", "recall", "plasticity", "action potential"],
    title: "Neurobiology & Synaptic Transmission",
    summary:
      "A comprehensive overview of neurocellular communication, long-term potentiation (LTP), neurotransmitter vesicle docking, and the electrophysiological basis of synaptic plasticity.",
    flashcards: [
      {
        front: "What is Long-Term Potentiation (LTP)?",
        back: "A persistent strengthening of synapses based on recent patterns of activity, producing a long-lasting increase in signal transmission between neurons.",
        hint: "Heard in the context of 'neurons that fire together, wire together'",
        category: "Neuroplasticity",
      },
      {
        front: "Which neurotransmitter is primary for excitatory signaling in the central nervous system?",
        back: "Glutamate, which activates AMPA, NMDA, and kainate ionotropic receptors.",
        hint: "An amino acid neurotransmitter",
        category: "Neurotransmitters",
      },
      {
        front: "What is the critical ion required for synaptic vesicle fusion at the axon terminal?",
        back: "Calcium (Ca2+), which enters through voltage-gated channels to trigger SNARE complex exocytosis.",
        hint: "Divalent cation with 2+ charge",
        category: "Cellular Physiology",
      },
      {
        front: "Define the refractory period of an action potential.",
        back: "The phase following an action potential where voltage-gated Na+ channels are inactivated, preventing or limiting subsequent firing.",
        hint: "Separated into absolute and relative phases",
        category: "Electrophysiology",
      },
    ],
    quiz: [
      {
        question: "Which receptor requires both glutamate binding AND membrane depolarization to remove its Mg2+ block?",
        options: ["AMPA Receptor", "NMDA Receptor", "GABA-A Receptor", "Nicotinic ACh Receptor"],
        correctOptionIndex: 1,
        explanation: "NMDA receptors are coincidence detectors: they require glutamate binding and membrane depolarization to expel the magnesium (Mg2+) ion blocking the pore.",
      },
      {
        question: "During saltatory conduction, action potentials propagate along myelinated axons by jumping between:",
        options: ["Nodes of Ranvier", "Dendritic Spines", "Axon Hillocks", "Synaptic Clefts"],
        correctOptionIndex: 0,
        explanation: "Action potentials jump between unmyelinated gaps known as Nodes of Ranvier, where voltage-gated sodium channels are highly concentrated.",
      },
    ],
  },
  {
    keywords: ["machine learning", "ai", "transformer", "neural network", "attention", "gradient", "model", "llm"],
    title: "Deep Learning Architectures & Attention Mechanisms",
    summary:
      "Core principles of modern artificial intelligence, focusing on self-attention mechanisms, transformer encoders/decoders, backpropagation, and optimization dynamics.",
    flashcards: [
      {
        front: "What is the mathematical formula for Scaled Dot-Product Attention?",
        back: "Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V",
        hint: "Computes query-key compatibility scaled by square root of key dimension",
        category: "Transformers",
      },
      {
        front: "What problem does the scaling factor (sqrt(d_k)) in attention address?",
        back: "For large values of d_k, dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients.",
        hint: "Prevents vanishing gradients in softmax",
        category: "Optimization",
      },
      {
        front: "Explain the fundamental difference between Encoder-only and Decoder-only models.",
        back: "Encoders (e.g. BERT) utilize bi-directional self-attention for representation, while Decoders (e.g. GPT) use causal/masked self-attention for autoregressive generation.",
        hint: "Bidirectional vs. causal masking",
        category: "Model Architecture",
      },
      {
        front: "What is Residual Connection (skip connection) and why is it used?",
        back: "It adds the input of a layer directly to its output (F(x) + x), allowing gradients to flow unimpeded during backpropagation to train very deep networks.",
        hint: "Introduced in ResNet and standard in Transformers",
        category: "Deep Learning",
      },
    ],
    quiz: [
      {
        question: "What is the computational complexity of standard self-attention with respect to sequence length (n)?",
        options: ["O(n)", "O(n log n)", "O(n^2)", "O(2^n)"],
        correctOptionIndex: 2,
        explanation: "Self-attention computes dot products between all pairs of tokens in the sequence, resulting in quadratic O(n^2) time and memory complexity.",
      },
      {
        question: "Why is layer normalization typically applied in Transformers instead of batch normalization?",
        options: [
          "LayerNorm operates independently across sequence lengths and batch sizes",
          "BatchNorm cannot be differentiated",
          "LayerNorm requires zero GPU memory",
          "BatchNorm only works with convolutional layers",
        ],
        correctOptionIndex: 0,
        explanation: "LayerNorm normalizes across features for each individual sequence token independently of batch size, making it ideal for variable-length NLP sequences.",
      },
    ],
  },
  {
    keywords: ["biology", "cell", "mitochondria", "dna", "rna", "protein", "photosynthesis", "atp", "enzyme"],
    title: "Molecular Biology & Cellular Energetics",
    summary:
      "Fundamental mechanisms of cellular biology, including oxidative phosphorylation, DNA replication, protein synthesis, and metabolic regulation.",
    flashcards: [
      {
        front: "What is the primary energetic yield mechanism of ATP synthase in mitochondria?",
        back: "Chemiosmotic coupling: the proton electrochemical gradient across the inner mitochondrial membrane drives the rotary catalysis of ATP from ADP + Pi.",
        hint: "Proton motive force across inner membrane",
        category: "Bioenergetics",
      },
      {
        front: "What role does tRNA play during ribosome translation?",
        back: "tRNA matches its specific anticodon to the mRNA codon and delivers the corresponding amino acid to the growing polypeptide chain.",
        hint: "Adapter molecule with cloverleaf structure",
        category: "Genetics",
      },
      {
        front: "Explain the central dogma of molecular biology.",
        back: "Genetic information flows unidirectionally from DNA (replication) -> RNA (transcription) -> Protein (translation).",
        hint: "DNA -> RNA -> Protein",
        category: "Molecular Genetics",
      },
      {
        front: "What are enzymes and how do they catalyze biochemical reactions?",
        back: "Biological catalysts (usually proteins) that lower the activation energy of a reaction without being consumed.",
        hint: "Active site binds transition state",
        category: "Biochemistry",
      },
    ],
    quiz: [
      {
        question: "Where does the citric acid (Krebs) cycle take place in eukaryotic cells?",
        options: ["Mitochondrial Matrix", "Cytosol", "Inner Membrane Interspace", "Rough Endoplasmic Reticulum"],
        correctOptionIndex: 0,
        explanation: "The citric acid cycle enzymes reside in the mitochondrial matrix, while the electron transport chain complexes are embedded in the inner membrane.",
      },
      {
        question: "Which enzyme is responsible for synthesizing mRNA from a DNA template during transcription?",
        options: ["RNA Polymerase II", "DNA Ligase", "DNA Polymerase III", "Helicase"],
        correctOptionIndex: 0,
        explanation: "In eukaryotes, RNA Polymerase II transcribes protein-coding genes into pre-mRNA.",
      },
    ],
  },
];

/**
 * Deterministically selects or generates high quality StudySet mock data
 */
export async function generateMockStudySet(inputText: string): Promise<StudySet> {
  // Simulate minimal realistic async latency (100ms)
  await new Promise((resolve) => setTimeout(resolve, 100));

  const lower = (inputText || "").toLowerCase();

  // Find matching template
  const matchedTemplate =
    TOPIC_TEMPLATES.find((tpl) => tpl.keywords.some((kw) => lower.includes(kw))) ||
    TOPIC_TEMPLATES[0];

  const snippet =
    inputText.trim().length > 0
      ? inputText.trim().slice(0, 150) + (inputText.trim().length > 150 ? "..." : "")
      : "Synthesized from user study material.";

  // Extract custom dynamic title if recognizable or use template
  const firstLine = inputText.trim().split("\n")[0]?.replace(/^#+\s*/, "").slice(0, 50);
  const title =
    firstLine && firstLine.length > 5 && firstLine.length < 50
      ? firstLine
      : matchedTemplate.title;

  return {
    id: crypto.randomUUID(),
    title,
    summary: matchedTemplate.summary,
    createdAt: Date.now(),
    sourceTextSnippet: snippet,
    flashcards: matchedTemplate.flashcards.map((f) => ({
      id: crypto.randomUUID(),
      front: f.front,
      back: f.back,
      hint: f.hint,
      category: f.category,
    })),
    quiz: matchedTemplate.quiz.map((q) => ({
      id: crypto.randomUUID(),
      question: q.question,
      options: [...q.options] as [string, string, string, string],
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
    })),
  };
}
