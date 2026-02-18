const VOCABULARY_BY_TOPIC = Object.fromEntries(
  TOPIC_CATALOG.flatMap((category) =>
    category.topics.map((topic) => [
      topic.id,
      {
        vocabulary: topic.vocabulary || [],
        pronunciationTips: topic.pronunciationTips || []
      }
    ])
  )
);

function getTopicVocabularyResources(topicId) {
  return VOCABULARY_BY_TOPIC[topicId] || { vocabulary: [], pronunciationTips: [] };
}
