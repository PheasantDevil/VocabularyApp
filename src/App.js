import React, { useState, useRef, useEffect } from 'react';
import { Button } from './components/ui/Button';
import { Card, CardContent } from './components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './components/ui/Dialog';
import { Input } from './components/ui/Input';
import { Label } from './components/ui/Label';

const VocabularyApp = () => {
  const [words, setWords] = useState([
    {
      id: 1,
      word: '猫',
      meaning: 'cat',
      description: '四足動物で、ペットとして人気がある。',
    },
    {
      id: 2,
      word: '犬',
      meaning: 'dog',
      description: '忠実な動物で、人間の親友と呼ばれる。',
    },
    {
      id: 3,
      word: '鳥',
      meaning: 'bird',
      description: '羽毛を持ち、多くの種類が空を飛ぶことができる。',
    },
  ]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWord, setNewWord] = useState({
    word: '',
    meaning: '',
    description: '',
  });
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWords, setFilteredWords] = useState(words);

  useEffect(() => {
    const results = words.filter(
      word =>
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWords(results);
  }, [searchTerm, words]);

  const handleWordSelect = word => {
    setSelectedWord(word);
  };

  const handleWordUpdate = e => {
    if (selectedWord) {
      const updatedWords = words.map(w =>
        w.id === selectedWord.id ? { ...w, [e.target.name]: e.target.value } : w
      );
      setWords(updatedWords);
      setSelectedWord({ ...selectedWord, [e.target.name]: e.target.value });
    }
  };

  const handleAddWord = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setNewWord({ word: '', meaning: '', description: '' });
  };

  const handleNewWordChange = e => {
    setNewWord({ ...newWord, [e.target.name]: e.target.value });
  };

  const handleNewWordSubmit = () => {
    if (newWord.word && newWord.meaning) {
      const newId = Math.max(...words.map(w => w.id), 0) + 1;
      setWords([...words, { id: newId, ...newWord }]);
      handleDialogClose();
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(words, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'vocabulary.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const importedWords = JSON.parse(e.target.result);
          if (
            Array.isArray(importedWords) &&
            importedWords.every(
              word =>
                typeof word === 'object' &&
                'id' in word &&
                'word' in word &&
                'meaning' in word
            )
          ) {
            setWords(importedWords);
          } else {
            alert(
              '無効なファイル形式です。正しいJSONファイルを選択してください。'
            );
          }
        } catch (error) {
          alert('ファイルの読み込み中にエラーが発生しました。');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      <header className='bg-gray-100 p-4 shadow-md'>
        <Input
          type='text'
          placeholder='単語を検索...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full max-w-md mx-auto'
        />
      </header>
      <div className='flex flex-1 overflow-hidden'>
        <div className='w-1/2 p-4 overflow-y-auto'>
          <h2 className='text-xl font-bold mb-4'>単語リスト</h2>
          <div className='flex space-x-2 mb-4'>
            <Button onClick={handleAddWord}>単語を追加する</Button>
            <Button onClick={handleExport}>エクスポート</Button>
            <Button onClick={() => fileInputRef.current.click()}>
              インポート
            </Button>
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleImport}
              accept='.json'
              style={{ display: 'none' }}
            />
          </div>
          {filteredWords.map(word => (
            <Card
              key={word.id}
              className='mb-2 cursor-pointer'
              onClick={() => handleWordSelect(word)}
            >
              <CardContent className='p-4'>
                <p className='font-bold'>{word.word}</p>
                <p>{word.meaning}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='w-1/2 p-4 border-l'>
          <h2 className='text-xl font-bold mb-4'>エディタ / 詳細</h2>
          {selectedWord ? (
            <div>
              <Input
                type='text'
                name='word'
                value={selectedWord.word}
                onChange={handleWordUpdate}
                className='w-full p-2 mb-2'
              />
              <Input
                type='text'
                name='meaning'
                value={selectedWord.meaning}
                onChange={handleWordUpdate}
                className='w-full p-2 mb-2'
              />
              <textarea
                name='description'
                value={selectedWord.description}
                onChange={handleWordUpdate}
                className='w-full p-2 mb-2 h-32 border rounded'
              />
            </div>
          ) : (
            <p>単語を選択してください</p>
          )}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しい単語を追加</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='word' className='text-right'>
                単語
              </Label>
              <Input
                id='word'
                name='word'
                value={newWord.word}
                onChange={handleNewWordChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='meaning' className='text-right'>
                意味
              </Label>
              <Input
                id='meaning'
                name='meaning'
                value={newWord.meaning}
                onChange={handleNewWordChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>
                説明
              </Label>
              <Input
                id='description'
                name='description'
                value={newWord.description}
                onChange={handleNewWordChange}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleDialogClose}>キャンセル</Button>
            <Button onClick={handleNewWordSubmit}>追加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VocabularyApp;
