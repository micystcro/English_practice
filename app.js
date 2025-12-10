// 簡單的詞庫與工具集合，儲存在 localStorage
(function(){
  const KEY = 'vocabList_v1';

  function getWords(){
    try{
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    }catch(e){
      return [];
    }
  }

  function saveWords(list){
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  // ⭐ 修改：加入 pos2（選填）
  function addWord(word, pos, def, pos2 = null){
    const list = getWords();
    list.push({
      word: (word||'').trim(),
      pos: (pos||'').trim(),
      pos2: (pos2||'').trim() || null,   // ← 第二詞性可以是 null
      def: (def||'').trim()
    });
    saveWords(list);
    return list;
  }

  function clearWords(){ 
    localStorage.removeItem(KEY);
  }

  // 當沒有資料時加入一些範例單字（保持原狀）
  function ensureSample(){
    const list = getWords();
    if (list.length === 0){
      const sample = [
        {word:'abundant', pos:'adjective', def:'existing or available in large quantities; plentiful', sample: true},
        {word:'emerge', pos:'verb', def:'to come into view or become known', sample: true},
        {word:'meticulous', pos:'adjective', def:'showing great attention to detail; very careful and precise', sample: true}
      ];
      saveWords(sample);
      return sample;
    }
    return list;
  }

  // 工具：格式化
  function normalize(s){ 
    return (s||'').toString().trim().toLowerCase(); 
  }

  window.vocab = {
    getWords,
    saveWords,
    addWord,
    clearWords,
    ensureSample,

    // ⭐ 可選：檢查答案（加入 pos2 兼容）
    checkAnswer(item, userWord, userPos){
      const okWord = normalize(item.word) === normalize(userWord);

      // 主要詞性正確 OR 第二詞性正確都算對（你可依需求調整）
      const okPos =
        normalize(item.pos) === normalize(userPos) ||
        normalize(item.pos2) === normalize(userPos);

      return {okWord, okPos};
    }
  };
})();

