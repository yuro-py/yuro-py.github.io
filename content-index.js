// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Source markdown lives in content/<section-name>/.
window.CONTENT_INDEX = {
  "sections": [
    {
      "slug": "projects",
      "label": "projects",
      "entries": [
        {
          "id": "2026-mar-20-trm_paper_implementation",
          "date": "2026-MAR-20",
          "title": "TRM paper implementation",
          "summary": "Overview",
          "content": "## Overview\nImplementation of \"Less is More: Recursive Reasoning with Tiny Networks\" paper with custom mini-uses.\n\n## Links\n- Repo: [TRM_impl](https://github.com/yuro-py/TRM_impl)"
        }
      ]
    },
    {
      "slug": "tech",
      "label": "tech",
      "entries": [
        {
          "id": "2026-mar-28-tiny_recursive_models",
          "date": "2026-MAR-28",
          "title": "tiny recursive models",
          "summary": "TRM Implementation Article:-",
          "content": "# TRM Implementation Article:-\n\n---\n\nIf you were a traditional LLM, this is how you would solve a sudoku puzzle:-\n\n1. Glance at the clues once\n2. Think super hard\n3. Solve the entire puzzle in one go\n\nAs a human, this sounds unnatural and impossible. There is a chance that you \"will\" solve the puzzle with this method, but building \"problem solving\" systems isn't about \"betting on one in a hundred chances\", but decisively move with the task at hand.\n\nHow, as a human would we solve a sudoku puzzle:-\n\n1. We read the puzzle\n2. Think, fill random values\n3. Verify, reconsider, correct it\n4. Iterate until reached the answer\n\nThis feels more natural, and this is is the system that's native to \"Tiny Recursive Models\" in the paper \"Less is More\" with ~7M parameters.\n\nThis method aced 87% accuracy on sudoku puzzles, with 100,000x times larger(parameter-wise) models were way behind using the \"think hard once and answer the entire thing\" method.\n\nFor years, \"scaling is power\" philosophy was leading the revolution, and it did push the frontiers ahead, but there were obvious moments where scaling hit the wall. Scaling does matter, but when it comes to reasoning capabilities(replicating human), architecture matters more than the number of parameters added.\n\nTakeaway -> \"increasing the size of you brain\" vs \"learning how to use your current brain\".\n\nBenefits of architecture-tweaking(TRM in this instance):-\n\n1. Run efficient reasoning models in consumer hardware(laptop/phone), it means no enterprise GPUs for each and everything.\n2. Reduce -> a) training cost b) training time from weeks -> hours.\n3. Better reasoning capabilities overall\n\n---\n\nTRM tracks three elements at its core:-\n\n1. x (the question) -> It remains constant, but is referred by the other two elements again and again to \"test\" the current iterated output.\n2. y (the current prediction/answer/output) -> it starts random and keeps getting refined and tested.\n3. z (the reasoning/scratchpad) -> this is where the model \"thinks\" how to predict the next \"y\" based upon the previous \"y\".\n\nThese three interact with each other through transformer layers.\n\n***TRM architecture:-***\n\n![image.jpg](files/image.jpg)\n\n***Benchmark results:-***\n\n![image1.jpg](files/image1.jpg)"
        }
      ]
    },
    {
      "slug": "writings",
      "label": "writings",
      "entries": []
    },
    {
      "slug": "extra",
      "label": "extra",
      "entries": []
    }
  ]
};
