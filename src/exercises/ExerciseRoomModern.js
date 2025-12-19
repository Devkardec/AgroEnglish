/* global React, ReactDOM */
/**
 * SALA DE EXERCÍCIOS MODERNA E AUTOMÁTICA
 * Componente totalmente novo, limpo e moderno
 * Funciona automaticamente para todos os níveis (A1-C2) e textos
 */

(function(){
  const e = React.createElement;

  // ============================================================
  // COMPONENTES MODERNOS DE EXERCÍCIOS
  // ============================================================

  /**
   * Card moderno para cada exercício
   */
  function ModernExerciseCard({ title, instruction, icon, children }) {
    return e('div', {
      className: 'bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all hover:shadow-xl'
    },
      e('div', {
        className: 'bg-gradient-to-r from-green-600 to-green-700 px-6 py-4'
      },
        e('div', { className: 'flex items-center gap-3' },
          icon ? e('span', { className: 'text-2xl' }, icon) : null,
          e('div', { className: 'flex-1' },
            e('h3', { className: 'text-white font-bold text-lg' }, title),
            instruction ? e('p', { className: 'text-green-100 text-sm mt-1' }, instruction) : null
          )
        )
      ),
      e('div', { className: 'p-6' }, children)
    );
  }

  /**
   * Exercício de Múltipla Escolha Moderno
   */
  function ModernMultipleChoice({ question, options, correctIndex, onComplete }) {
    const [selected, setSelected] = React.useState(null);
    const [result, setResult] = React.useState(null);
    const [checked, setChecked] = React.useState(false);

    const handleCheck = () => {
      if (selected === null) return;
      const isCorrect = selected === correctIndex;
      setResult(isCorrect);
      setChecked(true);
      if (onComplete) onComplete(isCorrect);
    };

    const handleSelect = (index) => {
      if (checked) return;
      setSelected(index);
    };

    return e('div', { className: 'space-y-4' },
      e('div', { className: 'text-lg font-semibold text-gray-800 mb-4' }, question),
      e('div', { className: 'space-y-3' },
        options.map((option, index) => {
          let bgColor = 'bg-gray-50 hover:bg-gray-100';
          let borderColor = 'border-gray-300';
          let textColor = 'text-gray-800';

          if (checked) {
            if (index === correctIndex) {
              bgColor = 'bg-green-100';
              borderColor = 'border-green-500';
              textColor = 'text-green-800';
            } else if (index === selected && index !== correctIndex) {
              bgColor = 'bg-red-100';
              borderColor = 'border-red-500';
              textColor = 'text-red-800';
            }
          } else if (selected === index) {
            bgColor = 'bg-blue-50';
            borderColor = 'border-blue-400';
            textColor = 'text-blue-800';
          }

          return e('button', {
            key: index,
            onClick: () => handleSelect(index),
            disabled: checked,
            className: `w-full text-left px-4 py-3 rounded-xl border-2 ${bgColor} ${borderColor} ${textColor} transition-all font-medium`
          },
            e('span', { className: 'mr-3 font-bold' }, String.fromCharCode(65 + index) + '.'),
            option
          );
        })
      ),
      e('div', { className: 'flex items-center gap-3 mt-4' },
        e('button', {
          onClick: handleCheck,
          disabled: selected === null || checked,
          className: `px-6 py-2 rounded-lg font-semibold transition-all ${
            selected === null || checked
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
          }`
        }, checked ? 'Verificado' : 'Verificar Resposta'),
        result !== null && e('div', {
          className: `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`
        },
          e('span', { className: 'text-xl' }, result ? '✓' : '✗'),
          result ? 'Correto!' : 'Tente novamente'
        )
      )
    );
  }

  /**
   * Exercício de Preencher Lacunas Moderno
   */
  function ModernFillBlank({ items, onComplete }) {
    const [values, setValues] = React.useState(Array(items.length).fill(''));
    const [results, setResults] = React.useState(Array(items.length).fill(null));
    const [checked, setChecked] = React.useState(false);

    const handleCheck = () => {
      const newResults = items.map((item, i) => {
        const userAnswer = String(values[i] || '').trim().toLowerCase();
        const correctAnswer = String(item.answer || '').trim().toLowerCase();
        return userAnswer === correctAnswer;
      });
      setResults(newResults);
      setChecked(true);
      if (onComplete) {
        const allCorrect = newResults.every(r => r);
        onComplete(allCorrect);
      }
    };

    const handleChange = (index, value) => {
      if (checked) return;
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
    };

    return e('div', { className: 'space-y-4' },
      items.map((item, index) => {
        const isCorrect = results[index];
        const hasResult = results[index] !== null;

        return e('div', {
          key: index,
          className: `p-4 rounded-xl border-2 transition-all ${
            hasResult
              ? isCorrect
                ? 'bg-green-50 border-green-400'
                : 'bg-red-50 border-red-400'
              : 'bg-gray-50 border-gray-300'
          }`
        },
          e('div', { className: 'text-sm font-semibold text-gray-700 mb-2' },
            `Questão ${index + 1}`
          ),
          e('div', { className: 'text-base text-gray-800 mb-3' },
            item.prompt.split('____').map((part, i, arr) => {
              if (i === arr.length - 1) return e('span', { key: i }, part);
              return e('span', { key: i },
                part,
                e('input', {
                  type: 'text',
                  value: values[index],
                  onChange: (ev) => handleChange(index, ev.target.value),
                  disabled: checked,
                  className: `mx-2 px-3 py-1 border-2 rounded-lg font-semibold text-center min-w-[100px] ${
                    hasResult
                      ? isCorrect
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-white border-gray-400 text-gray-800'
                  }`,
                  placeholder: '...'
                })
              );
            })
          ),
          hasResult && !isCorrect && e('div', {
            className: 'text-sm text-red-700 font-medium mt-2'
          }, `Resposta correta: ${item.answer}`)
        );
      }),
      e('button', {
        onClick: handleCheck,
        disabled: checked || values.some(v => !v.trim()),
        className: `w-full px-6 py-3 rounded-lg font-semibold text-white transition-all ${
          checked || values.some(v => !v.trim())
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
        }`
      }, checked ? 'Verificado' : 'Verificar Respostas')
    );
  }

  /**
   * Exercício Verdadeiro ou Falso Moderno
   */
  function ModernTrueFalse({ statements, onComplete }) {
    const [selections, setSelections] = React.useState(Array(statements.length).fill(null));
    const [results, setResults] = React.useState(Array(statements.length).fill(null));
    const [checked, setChecked] = React.useState(false);

    const handleCheck = () => {
      const newResults = statements.map((stmt, i) => {
        return selections[i] === stmt.correct;
      });
      setResults(newResults);
      setChecked(true);
      if (onComplete) {
        const allCorrect = newResults.every(r => r);
        onComplete(allCorrect);
      }
    };

    const handleSelect = (index, value) => {
      if (checked) return;
      const newSelections = [...selections];
      newSelections[index] = value;
      setSelections(newSelections);
    };

    return e('div', { className: 'space-y-4' },
      statements.map((stmt, index) => {
        const isCorrect = results[index];
        const hasResult = results[index] !== null;
        const selected = selections[index];

        return e('div', {
          key: index,
          className: `p-4 rounded-xl border-2 transition-all ${
            hasResult
              ? isCorrect
                ? 'bg-green-50 border-green-400'
                : 'bg-red-50 border-red-400'
              : 'bg-white border-gray-300'
          }`
        },
          e('div', { className: 'text-base font-medium text-gray-800 mb-3' }, stmt.text),
          e('div', { className: 'flex gap-3' },
            e('button', {
              onClick: () => handleSelect(index, true),
              disabled: checked,
              className: `flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                selected === true
                  ? hasResult
                    ? isCorrect
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`
            }, 'Verdadeiro'),
            e('button', {
              onClick: () => handleSelect(index, false),
              disabled: checked,
              className: `flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                selected === false
                  ? hasResult
                    ? isCorrect
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`
            }, 'Falso')
          )
        );
      }),
      e('button', {
        onClick: handleCheck,
        disabled: checked || selections.some(s => s === null),
        className: `w-full px-6 py-3 rounded-lg font-semibold text-white transition-all mt-4 ${
          checked || selections.some(s => s === null)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
        }`
      }, checked ? 'Verificado' : 'Verificar Respostas')
    );
  }

  /**
   * Exercício de Ditado Moderno (usa áudios automaticamente)
   */
  function ModernDictation({ sentences, audioUrls, level, idx, onComplete }) {
    const [values, setValues] = React.useState(Array(sentences.length).fill(''));
    const [results, setResults] = React.useState(Array(sentences.length).fill(null));
    const [checked, setChecked] = React.useState(false);
    const [playingIndex, setPlayingIndex] = React.useState(null);

    const normalize = (str) => String(str || '').trim().replace(/\s+/g, ' ').replace(/\s*([?.!])\s*$/, '$1').toLowerCase();

    const playAudio = (index) => {
      if (audioUrls && audioUrls[index]) {
        // Usar diretamente o audioUrl fornecido, com fallback se necessário
        const primaryUrl = audioUrls[index];
        const alternatives = level && idx ? getAudioUrlAlternatives(level, idx, index + 1) : [primaryUrl];
        
        const audio = new Audio(alternatives[0]);
        setPlayingIndex(index);
        
        // Tentar carregar com fallback
        let currentAlt = 0;
        const tryPlay = () => {
          if (currentAlt >= alternatives.length) {
            setPlayingIndex(null);
            return;
          }
          audio.src = alternatives[currentAlt];
          audio.play().catch(() => {
            currentAlt++;
            tryPlay();
          });
        };
        audio.onended = () => setPlayingIndex(null);
        audio.onerror = () => {
          currentAlt++;
          tryPlay();
        };
        tryPlay();
      }
    };

    const playAll = () => {
      if (!audioUrls || audioUrls.length === 0) return;
      let currentIndex = 0;
      const playNext = () => {
        if (currentIndex >= audioUrls.length) {
          setPlayingIndex(null);
          return;
        }
        setPlayingIndex(currentIndex);
        // Usar diretamente o audioUrl fornecido, com fallback se necessário
        const primaryUrl = audioUrls[currentIndex];
        const alternatives = level && idx ? getAudioUrlAlternatives(level, idx, currentIndex + 1) : [primaryUrl];
        let currentAlt = 0;
        const tryPlay = () => {
          if (currentAlt >= alternatives.length) {
            currentIndex++;
            playNext();
            return;
          }
          const audio = new Audio(alternatives[currentAlt]);
          audio.onended = () => {
            currentIndex++;
            playNext();
          };
          audio.onerror = () => {
            currentAlt++;
            tryPlay();
          };
          audio.play().catch(() => {
            currentAlt++;
            tryPlay();
          });
        };
        tryPlay();
      };
      playNext();
    };

    const handleCheck = () => {
      const newResults = sentences.map((sent, i) => {
        return normalize(sent) === normalize(values[i]);
      });
      setResults(newResults);
      setChecked(true);
      if (onComplete) {
        const allCorrect = newResults.every(r => r);
        onComplete(allCorrect);
      }
    };

    const handleChange = (index, value) => {
      if (checked) return;
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
    };

    return e('div', { className: 'space-y-4' },
      e('div', { className: 'flex items-center justify-between mb-4' },
        e('p', { className: 'text-sm text-gray-600' }, 'Ouça cada frase e escreva o que você ouviu'),
        audioUrls && audioUrls.length > 0 && e('button', {
          onClick: playAll,
          className: 'px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all'
        }, '▶ Reproduzir Todas')
      ),
      sentences.map((sentence, index) => {
        const isCorrect = results[index];
        const hasResult = results[index] !== null;

        return e('div', {
          key: index,
          className: `p-4 rounded-xl border-2 transition-all ${
            hasResult
              ? isCorrect
                ? 'bg-green-50 border-green-400'
                : 'bg-red-50 border-red-400'
              : 'bg-white border-gray-300'
          }`
        },
          e('div', { className: 'flex items-center gap-3 mb-3' },
            e('button', {
              onClick: () => playAudio(index),
              disabled: playingIndex === index,
              className: `px-4 py-2 rounded-lg font-semibold transition-all ${
                playingIndex === index
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`
            }, playingIndex === index ? '⏸ Reproduzindo...' : `▶ Ouvir ${index + 1}`)
          ),
          e('input', {
            type: 'text',
            value: values[index],
            onChange: (ev) => handleChange(index, ev.target.value),
            disabled: checked,
            placeholder: 'Digite o que você ouviu...',
            className: `w-full px-4 py-3 rounded-lg border-2 font-medium ${
              hasResult
                ? isCorrect
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : 'bg-red-100 border-red-500 text-red-800'
                : 'bg-white border-gray-400 text-gray-800'
            }`
          }),
          hasResult && !isCorrect && e('div', {
            className: 'text-sm text-red-700 font-medium mt-2'
          }, `Resposta correta: ${sentence}`)
        );
      }),
      e('button', {
        onClick: handleCheck,
        disabled: checked || values.some(v => !v.trim()),
        className: `w-full px-6 py-3 rounded-lg font-semibold text-white transition-all mt-4 ${
          checked || values.some(v => !v.trim())
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
        }`
      }, checked ? 'Verificado' : 'Verificar Respostas')
    );
  }

  /**
   * Exercício de Associação Visual Moderno
   */
  function ModernImageAssociation({ items, onComplete }) {
    const [topSelected, setTopSelected] = React.useState(null);
    const [matches, setMatches] = React.useState({});
    const [checked, setChecked] = React.useState(false);

    const handleTopClick = (index) => {
      if (checked || matches[index] !== undefined) return;
      setTopSelected(topSelected === index ? null : index);
    };

    const handleBottomClick = (index) => {
      if (checked || topSelected === null) return;
      if (index === topSelected) {
        setMatches({ ...matches, [topSelected]: index });
        setTopSelected(null);
      } else {
        setTopSelected(null);
      }
    };

    const handleCheck = () => {
      setChecked(true);
      const allMatched = items.every((_, i) => matches[i] !== undefined);
      if (onComplete) onComplete(allMatched);
    };

    const playAudio = (audioUrl) => {
      if (audioUrl) {
        try {
          // Usar diretamente o audioUrl fornecido
          const audio = new Audio(audioUrl);
          audio.play().catch(() => {
            // Se falhar, tentar fallback se level e idx estiverem disponíveis
            console.warn('Falha ao carregar áudio:', audioUrl);
          });
        } catch (err) {
          console.error('Erro ao reproduzir áudio:', err);
        }
      }
    };

    return e('div', { className: 'space-y-6' },
      e('div', { className: 'text-sm text-gray-600 mb-4' },
        `Acertos: ${Object.keys(matches).length}/${items.length}`
      ),
      // Imagens (topo)
      e('div', { className: 'grid grid-cols-4 gap-3' },
        items.map((item, index) => {
          const isMatched = matches[index] !== undefined;
          const isSelected = topSelected === index;

          return e('button', {
            key: index,
            onClick: () => handleTopClick(index),
            disabled: isMatched || checked,
            className: `relative rounded-xl border-2 overflow-hidden transition-all ${
              isMatched
                ? 'border-green-500 bg-green-100'
                : isSelected
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`
          },
            e('img', {
              src: item.src,
              alt: '',
              className: 'w-full h-24 object-cover',
              onError: (ev) => {
                ev.target.style.display = 'none';
                ev.target.parentElement.innerHTML = '<div class="w-full h-24 flex items-center justify-center bg-gray-100 text-gray-400">Imagem</div>';
              }
            }),
            isMatched && e('div', {
              className: 'absolute top-1 left-1 w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold'
            }, index + 1)
          );
        })
      ),
      // Textos (baixo)
      e('div', { className: 'grid grid-cols-4 gap-3' },
        items.map((item, index) => {
          const isMatched = Object.values(matches).includes(index);
          const isSelected = topSelected === index;

          return e('button', {
            key: index,
            onClick: () => {
              handleBottomClick(index);
              if (item.audio) playAudio(item.audio);
            },
            disabled: isMatched || checked,
            className: `px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              isMatched
                ? 'border-green-500 bg-green-100 text-green-800'
                : isSelected
                ? 'border-blue-500 bg-blue-100 text-blue-800'
                : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
            }`
          }, item.text);
        })
      ),
      e('button', {
        onClick: handleCheck,
        disabled: checked || Object.keys(matches).length !== items.length,
        className: `w-full px-6 py-3 rounded-lg font-semibold text-white transition-all mt-4 ${
          checked || Object.keys(matches).length !== items.length
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
        }`
      }, checked ? 'Verificado' : 'Verificar Associações')
    );
  }

  // ============================================================
  // FUNÇÕES AUXILIARES AUTOMÁTICAS
  // ============================================================

  /**
   * Gera automaticamente URLs de áudio baseado no padrão de pastas
   * Padrão REAL: ${sentenceIndex}.${textId}.mp3 (ex: 1.1.mp3 = frase 1 do texto 1, 2.3.mp3 = frase 2 do texto 3)
   * NOTA: Usa /src/audio porque os arquivos estão em src/audio/ no sistema de arquivos
   */
  function generateAudioUrls(level, idx, count) {
    const levelUpper = String(level || '').toUpperCase();
    const levelLower = String(level || '').toLowerCase();
    const textId = Number(idx) || 1;
    const basePath = `/src/audio/${levelUpper}/texto-${levelLower}.${textId}-dividido`;
    
    // Para cada índice de frase, gerar: ${sentenceIndex}.${textId}.mp3
    return Array.from({ length: count }, (_, i) => {
      const sentenceIndex = i + 1;
      return `${basePath}/${sentenceIndex}.${textId}.mp3`;
    });
  }
  
  /**
   * Função auxiliar para obter URLs alternativas de um áudio (fallback)
   * Retorna array de URLs em ordem de prioridade para tentar carregar
   * Padrão principal: ${sentenceIndex}.${textId}.mp3
   * NOTA: Usa /src/audio porque os arquivos estão em src/audio/ no sistema de arquivos
   */
  function getAudioUrlAlternatives(level, idx, sentenceIndex) {
    const levelUpper = String(level || '').toUpperCase();
    const levelLower = String(level || '').toLowerCase();
    const textId = Number(idx) || 1;
    const basePath = `/src/audio/${levelUpper}/texto-${levelLower}.${textId}-dividido`;
    
    // Ordem de prioridade: padrão ouro primeiro, depois fallbacks
    return [
      `${basePath}/${sentenceIndex}.${textId}.mp3`,                    // Tentativa 1: Padrão ouro (ex: 1.1.mp3)
      `${basePath}/${String(sentenceIndex).padStart(2,'0')}.${textId}.mp3`,  // Tentativa 2: Com zero à esquerda (ex: 01.1.mp3)
      `${basePath}/${sentenceIndex}.mp3`                                // Tentativa 3: Apenas índice (ex: 1.mp3)
    ];
  }
  
  /**
   * Carrega um áudio com sistema de fallback inteligente
   * Tenta múltiplas URLs até encontrar uma que funcione
   */
  function loadAudioWithFallback(urls, onSuccess, onError) {
    if (!Array.isArray(urls) || urls.length === 0) {
      if (onError) onError();
      return null;
    }
    
    let currentIndex = 0;
    const tryNext = () => {
      if (currentIndex >= urls.length) {
        if (onError) onError();
        return null;
      }
      
      const audio = new Audio(urls[currentIndex]);
      
      audio.addEventListener('canplaythrough', () => {
        if (onSuccess) onSuccess(audio);
      });
      
      audio.addEventListener('error', () => {
        currentIndex++;
        tryNext();
      });
      
      audio.load();
      return audio;
    };
    
    return tryNext();
  }
  
  /**
   * Reproduz um áudio com fallback automático
   */
  function playAudioWithFallback(urls) {
    if (!Array.isArray(urls) || urls.length === 0) return;
    
    let currentIndex = 0;
    const tryNext = () => {
      if (currentIndex >= urls.length) return;
      
      const audio = new Audio(urls[currentIndex]);
      
      audio.addEventListener('error', () => {
        currentIndex++;
        tryNext();
      });
      
      audio.play().catch(() => {
        currentIndex++;
        tryNext();
      });
    };
    
    tryNext();
  }

  /**
   * Gera automaticamente items de associação visual baseado nos pairs
   * Padrão REAL imagem: ${sentenceIndex}.${textId}.webp (ex: 1.1.webp = frase 1 do texto 1)
   * Padrão REAL áudio: ${sentenceIndex}.${textId}.mp3 (ex: 1.1.mp3 = frase 1 do texto 1)
   */
  function generateImageItems(level, idx, pairs, maxCount = 8) {
    const levelUpper = String(level || '').toUpperCase();
    const levelLower = String(level || '').toLowerCase();
    const textId = Number(idx) || 1;
    
    if (!Array.isArray(pairs) || pairs.length === 0) return [];
    
    const items = [];
    const count = Math.min(pairs.length, maxCount);
    const baseImagePath = `/public/images/${levelUpper}/${levelLower}texto${textId}`;
    const baseAudioPath = `/src/audio/${levelUpper}/texto-${levelLower}.${textId}-dividido`;
    
    for (let i = 0; i < count; i++) {
      const pair = pairs[i];
      if (pair && pair.en) {
        const sentenceIndex = i + 1;
        items.push({
          src: `${baseImagePath}/${sentenceIndex}.${textId}.webp`,
          text: String(pair.en).trim(),
          audio: `${baseAudioPath}/${sentenceIndex}.${textId}.mp3`
        });
      }
    }
    
    return items;
  }

  /**
   * Extrai exercícios automaticamente do JSON
   */
  function extractExercises(data, level, idx) {
    const exercises = data.exercises || {};
    const ex = data.a1_exercises || {};
    
    // Múltipla escolha
    const multipleChoice = Array.isArray(exercises.multiple_choice) 
      ? exercises.multiple_choice 
      : [];
    
    // Preencher lacunas
    const fillIn = Array.isArray(exercises.fill_in)
      ? exercises.fill_in
      : [];
    
    // Verdadeiro ou Falso (gerar automaticamente das frases)
    const trueFalse = (() => {
      const sentences = Array.isArray(data.pairs)
        ? data.pairs.map(p => p.en).slice(0, 3)
        : String(data.text || '').split(/(?<=[.!?])\s+/).slice(0, 3);
      
      return sentences.map((sent, i) => ({
        text: sent.trim(),
        correct: i % 2 === 0 // Alterna entre verdadeiro e falso
      }));
    })();
    
    // Ditado (usar pairs ou texto)
    const dictationSentences = Array.isArray(data.pairs)
      ? data.pairs.map(p => p.en).slice(0, 6)
      : String(data.text || '').split(/(?<=[.!?])\s+/).slice(0, 6);
    
    const dictationAudioUrls = generateAudioUrls(level, idx, dictationSentences.length);
    
    // Associação visual
    const imageItems = generateImageItems(level, idx, data.pairs || [], 8);
    
    return {
      multipleChoice,
      fillIn,
      trueFalse,
      dictation: {
        sentences: dictationSentences.filter(s => s && s.trim()),
        audioUrls: dictationAudioUrls
      },
      imageAssociation: imageItems
    };
  }

  // ============================================================
  // COMPONENTE PRINCIPAL - SALA DE EXERCÍCIOS MODERNA
  // ============================================================

  function ModernExerciseRoom({ data, idx, level }) {
    const levelUpper = String(level || '').toUpperCase();
    const title = String(data.uiTitle || data.title || `Texto ${idx}`).trim();
    
    const exercises = extractExercises(data, level, idx);
    const [completed, setCompleted] = React.useState({});

    const handleComplete = (exerciseType, isCorrect) => {
      setCompleted({ ...completed, [exerciseType]: isCorrect });
    };

    return e('div', { className: 'w-full max-w-5xl mx-auto px-4 py-6' },
      // Header
      e('div', { className: 'mb-8' },
        e('div', { className: 'flex items-center justify-between mb-2' },
          e('h1', { className: 'text-3xl font-bold text-gray-900' }, title),
          e('div', { className: 'px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold' },
            `Nível ${levelUpper}`
          )
        ),
        e('p', { className: 'text-gray-600' }, 'Pratique e teste seus conhecimentos')
      ),

      // Grid de Exercícios
      e('div', { className: 'grid grid-cols-1 gap-6' },
        // Múltipla Escolha
        exercises.multipleChoice.length > 0 && exercises.multipleChoice.map((item, index) =>
          e(ModernExerciseCard, {
            key: `mc-${index}`,
            title: 'Múltipla Escolha',
            instruction: 'Selecione a resposta correta',
            icon: '📝'
          },
            e(ModernMultipleChoice, {
              question: item.question,
              options: item.options,
              correctIndex: item.answer,
              onComplete: (correct) => handleComplete(`mc-${index}`, correct)
            })
          )
        ),

        // Preencher Lacunas
        exercises.fillIn.length > 0 && e(ModernExerciseCard, {
          title: 'Preencher Lacunas',
          instruction: 'Complete as frases com as palavras corretas',
          icon: '✏️'
        },
          e(ModernFillBlank, {
            items: exercises.fillIn.map(item => ({
              prompt: item.sentence,
              answer: item.answer
            })),
            onComplete: (allCorrect) => handleComplete('fill', allCorrect)
          })
        ),

        // Verdadeiro ou Falso
        exercises.trueFalse.length > 0 && e(ModernExerciseCard, {
          title: 'Verdadeiro ou Falso',
          instruction: 'Marque se cada afirmação é verdadeira ou falsa',
          icon: '✓'
        },
          e(ModernTrueFalse, {
            statements: exercises.trueFalse,
            onComplete: (allCorrect) => handleComplete('tf', allCorrect)
          })
        ),

        // Ditado
        exercises.dictation.sentences && exercises.dictation.sentences.length > 0 && e(ModernExerciseCard, {
          title: 'Ditado',
          instruction: 'Ouça e escreva o que você ouviu',
          icon: '🎧'
        },
          e(ModernDictation, {
            sentences: exercises.dictation.sentences,
            audioUrls: exercises.dictation.audioUrls,
            level: level,
            idx: idx,
            onComplete: (allCorrect) => handleComplete('dictation', allCorrect)
          })
        ),

        // Associação Visual
        exercises.imageAssociation.length > 0 && e(ModernExerciseCard, {
          title: 'Associação Visual',
          instruction: 'Associe cada imagem à frase correspondente',
          icon: '🖼️'
        },
          e(ModernImageAssociation, {
            items: exercises.imageAssociation,
            onComplete: (allMatched) => handleComplete('image', allMatched)
          })
        )
      ),

      // Footer de Progresso
      Object.keys(completed).length > 0 && e('div', {
        className: 'mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border-2 border-green-200'
      },
        e('div', { className: 'text-center' },
          e('h3', { className: 'text-xl font-bold text-gray-900 mb-2' }, 'Progresso'),
          e('div', { className: 'text-3xl font-bold text-green-700' },
            `${Object.keys(completed).length} exercício(s) completado(s)`
          )
        )
      )
    );
  }

  // ============================================================
  // EXPORT PARA MONTAGEM
  // ============================================================

  window.ModernExerciseRoomMount = function(level, idx, data) {
    const practiceTab = document.getElementById('tab-practice');
    if (!practiceTab || practiceTab.style.display === 'none') return;
    
    const rootEl = document.getElementById('exercisePageRoot');
    if (!rootEl) return;
    
    // Limpar conteúdo antigo
    rootEl.innerHTML = '';
    
    // Renderizar novo componente
    const tree = e(ModernExerciseRoom, { data, idx, level });
    if (ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(rootEl);
      root.render(tree);
    } else {
      ReactDOM.render(tree, rootEl);
    }
  };

})();
