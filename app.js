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
  function addWord(word,pos,def){
    const list = getWords();
    list.push({word: (word||'').trim(), pos: (pos||'').trim(), def: (def||'').trim()});
    saveWords(list);
    return list;
  }
  function clearWords(){ localStorage.removeItem(KEY); }

  // 當沒有資料時加入一些範例單字
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

  function normalize(s){ return (s||'').toString().trim().toLowerCase(); }

  window.vocab = {
    getWords,
    saveWords,
    addWord,
    clearWords,
    ensureSample,
    // 檢查答案 (簡單比對，忽略大小寫與前後空白)
    checkAnswer(item, userWord, userPos){
      const okWord = normalize(item.word) === normalize(userWord);
      const okPos = normalize(item.pos) === normalize(userPos);
      return {okWord, okPos};
    }
  };
})();
