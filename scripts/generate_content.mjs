import { mkdir, writeFile, access } from 'fs/promises'
import { constants } from 'fs'
const base = process.cwd()
const levels = ['A1','A2','B1','B2','C1','C2']
const topics = ['Farm routine','Planting','Harvest','Tractors','Combines','Sprayers','Cattle','Swine','Poultry','Veterinary','Greenhouse','Irrigation','Pasture','Canadian winter','Safety','Fruit & veg sales','Maintenance','Workers day']

function ensureDir(p) { return mkdir(p, { recursive: true }) }
async function exists(p) { try { await access(p, constants.F_OK); return true } catch { return false } }

function genTitle(level, i) {
  const map = {
    A1: ['Feeding the cows','Starting the tractor','Checking the plants','Morning at the farm','Water for animals'],
    A2: ['My day at the dairy farm','Fixing the irrigation','Cleaning the barn','Simple planting plan','Working with safety'],
    B1: ['Routine harvest challenges','Calibrating the sprayer','Pasture rotation story','Veterinary check day','Tractor maintenance'],
    B2: ['Efficient combine operation','Biosecurity protocols','Rotational grazing management','Irrigation scheduling','Greenhouse climate control'],
    C1: ['Soil nutrient assessment','Herd health coordination','Precision ag telemetry','Feed formulation strategy','Equipment reliability analysis'],
    C2: ['Sustainable livestock strategy','Cross-border biosecurity compliance','Resource allocation in large-scale farming','Advanced agronomy review','Veterinary diagnostic frameworks']
  }
  const arr = map[level]
  return arr[i % arr.length]
}

function genText(level, title) {
  switch(level){
    case 'A1': return `I work on a farm. ${title}. I feed animals and check plants. I use simple tools.`
    case 'A2': return `This is my day on the farm. ${title}. I follow a routine, clean areas, and adjust irrigation when needed.`
    case 'B1': return `At the farm, we face small challenges. ${title}. We plan tasks, monitor animals, and fix machines when issues arise.`
    case 'B2': return `We operate agricultural machines and apply technical procedures. ${title}. We record data and follow safety regulations.`
    case 'C1': return `We analyze systems and optimize operations. ${title}. We interpret data, design protocols, and coordinate technical workflows.`
    case 'C2': return `We develop advanced strategies for professional agriculture. ${title}. We evaluate evidence, ensure compliance, and lead complex projects.`
  }
}

function genTr(level, text) {
  return `Tradução (PT-BR): ${text.replaceAll('farm','fazenda').replaceAll('animals','animais')}`
}

function genVocab() {
  const base = [
    ['tractor','trator'],['cow','vaca'],['corn','milho'],['sprayer','pulverizador'],['harvest','colheita'],
    ['irrigation','irrigação'],['pasture','pastagem'],['greenhouse','estufa'],['veterinary','veterinária'],['safety','segurança']
  ]
  return base.map(([word,meaning])=>({ word, meaning }))
}

function genGrammar(level) {
  return level==='A1' ? 'Present simple with farm routines.' :
         level==='A2' ? 'Adverbs of frequency and routine sequencing.' :
         level==='B1' ? 'Past simple for work stories; modals for advice.' :
         level==='B2' ? 'Passive voice in technical procedures.' :
         level==='C1' ? 'Complex clauses: purpose and result; nominalization.' :
                         'Academic style: hedging and precise terminology.'
}

function genVerbs() {
  return 'Verbs used: feed, check, start, clean, adjust, monitor, operate, record, assess, coordinate.'
}

function genMC() {
  return [
    { question:'What do we check every morning?', options:['Plants','Emails','Movies','Games'], answer:0 },
    { question:'Which machine is for spraying?', options:['Sprayer','Oven','Printer','Mixer'], answer:0 },
    { question:'Which word means safety in Portuguese?', options:['Segurança','Caminhão','Estábulo','Café'], answer:0 }
  ]
}
function genFill() {
  return [
    { sentence:'We ____ the cows every morning.', answer:'feed' },
    { sentence:'Start the ____ carefully.', answer:'tractor' },
    { sentence:'Check the ____ for the animals.', answer:'water' }
  ]
}
function genSpeaking(title) { return `Repeat: ${title}` }

async function run() {
  for (const lvl of levels) {
    const dir = `${base}/src/data/texts/${lvl}`
    await ensureDir(dir)
    for (let i=1;i<=20;i++){
      const t = genTitle(lvl, i)
      const text = genText(lvl, t)
      const obj = {
        title: t,
        text,
        translation: genTr(lvl, text),
        vocabulary: genVocab(),
        grammar: genGrammar(lvl),
        verbs: genVerbs(),
        exercises: {
          multiple_choice: genMC(),
          fill_in: genFill(),
          speaking: genSpeaking(t)
        }
      }
      const file = `${dir}/text${i}.json`
      if (!(await exists(file))) {
        await writeFile(file, JSON.stringify(obj, null, 2), 'utf-8')
      }
    }
  }
  console.log('Conteúdos gerados em /src/data/texts/<LEVEL>/text<n>.json')
}
run().catch(e=>{ console.error(e); process.exit(1) })

