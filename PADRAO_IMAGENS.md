# 📸 Padrão para Adicionar Imagens nas Aulas

Este documento descreve o padrão estabelecido para adicionar imagens nas salas de exercícios e laboratório de fala para novos textos e níveis.

## 🎯 Estrutura de Pastas

```
/public/images/{LEVEL}/{level}texto{idx}/
```

**Exemplos:**
- A1 Texto 1: `/public/images/A1/a1texto1/`
- A2 Texto 1: `/public/images/A2/a2texto1/`
- B1 Texto 1: `/public/images/B1/b1texto1/`

## 📝 Nomenclatura das Imagens

### Padrão Geral
- **Formato:** `{n}.{idx}.webp`
- **Exemplo A1 Texto 1:** `1.1.webp`, `2.1.webp`, `3.1.webp`, etc.
- **Exemplo A1 Texto 2:** `1.2.webp`, `2.2.webp`, `3.2.webp`, etc.

### Exceção: A2 Texto 1
- **Formato:** `{n}.1.webp` (mesmo padrão, mas mantém `.1` fixo)
- **Exemplo:** `1.1.webp`, `2.1.webp`, `3.1.webp`, etc.

## 🔧 Implementação

### 1. Sala de Exercícios - Jogo de Memória

**Arquivo:** `src/exercises/exercises.js`

**Localização:** Função `deriveMemoryPairs()`

**Passos:**
1. Adicionar detecção do nível:
   ```javascript
   const isA2 = String(level||'').toUpperCase()==='A2';
   const isA2Tx1 = isA2 && Number(idx)===1;
   ```

2. Adicionar bloco condicional:
   ```javascript
   if (isA2Tx1) {
     const lines = Array.isArray(data.pairs)
       ? data.pairs.map(p=> String(p.en||'').trim())
       : (Array.isArray(ex.narration_sentences)
           ? ex.narration_sentences
           : (Array.isArray(data.lines)
               ? data.lines.map(l=> String(l.en||'').trim())
               : String(data.text||'').split(/(?<=[.!?])\s+/)));
     return [
       { src:'/public/images/A2/a2texto1/1.1.webp', text: String(lines[0]||'').trim() },
       { src:'/public/images/A2/a2texto1/2.1.webp', text: String(lines[1]||'').trim() },
       // ... continuar para todas as imagens
     ];
   }
   ```

### 2. Sala de Exercícios - Associação Visual

**Arquivo:** `src/exercises/exercises.js`

**Localização:** Função `ExercisePageLayout()` - componente `ImageSentenceAssociation`

**Passos:**
1. Adicionar condição na verificação:
   ```javascript
   ((isA1 && ...) || (isA2 && Number(idx)===1))
   ```

2. Adicionar array de items:
   ```javascript
   (isA2 && Number(idx)===1 ? [
     { src:'/public/images/A2/a2texto1/1.1.webp', 
       text:'Frase em inglês', 
       audio:'/src/audio/A2/texto-a2.1-dividido/part_01.mp3' },
     // ... continuar para todas as imagens
   ] : ...)
   ```

### 3. Laboratório de Fala

**Arquivo:** `main.js`

**Localização:** Função `initTextPage()` - seção do `pronList`

**Passos:**

1. **Habilitar imagens:**
   ```javascript
   const useImages = (isA1 && Number(idx) >= 1) || (isA2 && Number(idx) === 1);
   ```

2. **Adicionar lógica de imagens:**
   ```javascript
   if (useImages) {
     const levelUpper = String(level||'A1').toUpperCase();
     const levelLower = String(level||'A1').toLowerCase();
     if (isA2 && Number(idx) === 1) {
       // Padrão específico se necessário
       imgs = Array.from({length:imgCountBase}, (_,i)=> 
         `/public/images/${levelUpper}/${levelLower}texto${idx}/${i+1}.1.webp`);
     } else {
       // Padrão genérico
       imgs = Array.from({length:imgCountBase}, (_,i)=> 
         `/public/images/${levelUpper}/${levelLower}texto${idx}/${i+1}.${idx}.webp`);
     }
   }
   ```

3. **Adicionar áudios:**
   ```javascript
   else if (isA2 && Number(idx) === 1) {
     segUrls = Array.from({length:imgCountBase}, (_,i)=> 
       `/src/audio/A2/texto-a2.1-dividido/part_${String(i+1).padStart(2,'0')}.mp3`);
   }
   ```

## 🎵 Estrutura de Áudios

**Padrão:** `/src/audio/{LEVEL}/texto-{level}.{idx}-dividido/part_{NN}.mp3`

**Exemplos:**
- A2 Texto 1: `/src/audio/A2/texto-a2.1-dividido/part_01.mp3`
- A2 Texto 2: `/src/audio/A2/texto-a2.2-dividido/part_01.mp3`

**Nomenclatura dos arquivos:**
- `part_01.mp3`, `part_02.mp3`, `part_03.mp3`, etc.
- Usar `padStart(2,'0')` para garantir dois dígitos (01, 02, 03...)

## ✅ Checklist para Novos Textos

- [ ] Criar pasta de imagens: `/public/images/{LEVEL}/{level}texto{idx}/`
- [ ] Adicionar imagens com nomenclatura correta: `{n}.{idx}.webp`
- [ ] Adicionar detecção do nível em `deriveMemoryPairs()`
- [ ] Adicionar bloco condicional com mapeamento imagem-frase
- [ ] Adicionar condição na associação visual
- [ ] Adicionar array de items com src, text e audio
- [ ] Habilitar imagens no laboratório de fala
- [ ] Adicionar lógica de geração de caminhos de imagens
- [ ] Adicionar áudios divididos na seção `segUrls`
- [ ] Testar todas as funcionalidades

## 📌 Exemplo Completo: A2 Texto 1

### Estrutura de Arquivos
```
/public/images/A2/a2texto1/
  ├── 1.1.webp
  ├── 2.1.webp
  ├── 3.1.webp
  ├── 4.1.webp
  ├── 5.1.webp
  ├── 6.1.webp
  ├── 7.1.webp
  └── 8.1.webp

/src/audio/A2/texto-a2.1-dividido/
  ├── part_01.mp3
  ├── part_02.mp3
  ├── part_03.mp3
  ├── part_04.mp3
  ├── part_05.mp3
  ├── part_06.mp3
  ├── part_07.mp3
  └── part_08.mp3
```

### Mapeamento Imagem-Frase
1. `1.1.webp` → "Yesterday was a very busy day."
2. `2.1.webp` → "The weather was cold and rainy in the morning."
3. `3.1.webp` → "The corn field was muddy."
4. `4.1.webp` → "It was difficult to drive there."
5. `5.1.webp` → "The cows were in the barn because they were hungry."
6. `6.1.webp` → "One calf was sick, but the vet was here quickly."
7. `7.1.webp` → "The tractors were in the garage. They were not broken."
8. `8.1.webp` → "We were tired at night, but the animals were safe."

## 🔍 Notas Importantes

1. **Sempre verificar** se as imagens existem antes de adicionar ao código
2. **Manter consistência** na nomenclatura entre imagens e áudios
3. **Testar** todas as funcionalidades após adicionar imagens
4. **Não quebrar** funcionalidades existentes - apenas adicionar novas condições
5. **Seguir o padrão** estabelecido para facilitar manutenção futura
