$ErrorActionPreference = 'Stop'
$base = (Get-Location).Path
$levels = @('A1','A2','B1','B2','C1','C2')

function Ensure-Dir($p) {
  if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p | Out-Null }
}

function Get-Title($level, $i) {
  switch ($level) {
    'A1' { $arr = @('Feeding the cows','Starting the tractor','Checking the plants','Morning at the farm','Water for animals') }
    'A2' { $arr = @('My day at the dairy farm','Fixing the irrigation','Cleaning the barn','Simple planting plan','Working with safety') }
    'B1' { $arr = @('Routine harvest challenges','Calibrating the sprayer','Pasture rotation story','Veterinary check day','Tractor maintenance') }
    'B2' { $arr = @('Efficient combine operation','Biosecurity protocols','Rotational grazing management','Irrigation scheduling','Greenhouse climate control') }
    'C1' { $arr = @('Soil nutrient assessment','Herd health coordination','Precision ag telemetry','Feed formulation strategy','Equipment reliability analysis') }
    'C2' { $arr = @('Sustainable livestock strategy','Cross-border biosecurity compliance','Resource allocation in large-scale farming','Advanced agronomy review','Veterinary diagnostic frameworks') }
  }
  return $arr[$i % $arr.Length]
}

function Get-Pairs($level) {
  $pairs = @(
    @{ en='I work on Green Valley Farm, and every day is busy.'; pt='Eu trabalho na Fazenda Vale Verde, e todos os dias são corridos.' },
    @{ en='In the morning, I wake up early and walk to the fields.'; pt='De manhã, eu acordo cedo e caminho até os campos.' },
    @{ en='The sun is low, and the soil is cool and soft.'; pt='O sol está baixo, e o solo está fresco e macio.' },
    @{ en='I check the crops to see if the plants are healthy.'; pt='Eu verifico as plantações para ver se as plantas estão saudáveis.' },
    @{ en='I feed the cows and make sure they have clean water.'; pt='Eu alimento as vacas e garanto que elas tenham água limpa.' },
    @{ en='The tractor starts slowly; I drive carefully on the farm road.'; pt='O trator liga devagar; eu dirijo com cuidado na estrada da fazenda.' },
    @{ en='We plan the day: planting, irrigation, and equipment checks.'; pt='Nós planejamos o dia: plantio, irrigação e checagem dos equipamentos.' },
    @{ en='Veterinary biosecurity keeps the herd healthy.'; pt='A biossegurança veterinária mantém o rebanho saudável.' },
    @{ en='We rotate pastures to improve forage quality.'; pt='Nós rotacionamos as pastagens para melhorar a qualidade do forrageio.' },
    @{ en='The greenhouse helps control temperature and humidity.'; pt='A estufa ajuda a controlar a temperatura e a umidade.' },
    @{ en='Irrigation is scheduled to reduce water waste.'; pt='A irrigação é programada para reduzir o desperdício de água.' },
    @{ en='Sprayer calibration prevents over application.'; pt='A calibração do pulverizador evita aplicação excessiva.' },
    @{ en='We record yields and monitor feed intake.'; pt='Nós registramos a produtividade e monitoramos a ingestão de ração.' },
    @{ en='In Canadian winter, we protect equipment from freezing.'; pt='No inverno canadense, protegemos os equipamentos contra o congelamento.' },
    @{ en='Farm safety rules are part of our routine.'; pt='As regras de segurança rural fazem parte da nossa rotina.' },
    @{ en='I clean the barn after milking and store the tools.'; pt='Eu limpo o celeiro após a ordenha e guardo as ferramentas.' },
    @{ en='We sell fresh vegetables at the local market.'; pt='Nós vendemos hortaliças frescas no mercado local.' },
    @{ en='Maintenance avoids breakdowns during harvest.'; pt='A manutenção evita falhas durante a colheita.' },
    @{ en='We use gloves and masks when handling chemicals.'; pt='Usamos luvas e máscaras ao manusear produtos químicos.' },
    @{ en='I talk to the team and assign tasks for the afternoon.'; pt='Eu converso com a equipe e distribuo as tarefas para a tarde.' }
  )
  if ($level -in @('B2','C1','C2')) {
    $pairs += @(
      @{ en='We assess soil nutrients to optimize fertilization plans.'; pt='Avaliamos nutrientes do solo para otimizar planos de fertilização.' },
      @{ en='Telemetry from precision agriculture guides irrigation decisions.'; pt='A telemetria da agricultura de precisão orienta decisões de irrigação.' },
      @{ en='We apply rotational grazing protocols for pasture recovery.'; pt='Aplicamos protocolos de pastejo rotativo para recuperação da pastagem.' }
    )
  }
  return $pairs
}

function Get-TextFromPairs($title, $pairs, $count) {
  $selected = $pairs | Get-Random -Count $count
  $en = $selected | ForEach-Object { $_.en }
  $text = "$title. " + ($en -join ' ')
  return @{ text = $text; pairs = $selected }
}

$vocab = @(
  @{ word='tractor'; meaning='trator' },
  @{ word='cow'; meaning='vaca' },
  @{ word='corn'; meaning='milho' },
  @{ word='sprayer'; meaning='pulverizador' },
  @{ word='harvest'; meaning='colheita' },
  @{ word='irrigation'; meaning='irrigação' },
  @{ word='pasture'; meaning='pastagem' },
  @{ word='greenhouse'; meaning='estufa' },
  @{ word='veterinary'; meaning='veterinária' },
  @{ word='safety'; meaning='segurança' }
)

function Get-Grammar($level) {
  switch ($level) {
    'A1' { 'Present simple with farm routines.' }
    'A2' { 'Adverbs of frequency and routine sequencing.' }
    'B1' { 'Past simple for work stories; modals for advice.' }
    'B2' { 'Passive voice in technical procedures.' }
    'C1' { 'Complex clauses: purpose and result; nominalization.' }
    'C2' { 'Academic style: hedging and precise terminology.' }
  }
}

function Get-Obj($level, $i) {
  $title = Get-Title $level $i
  $pool = Get-Pairs $level
  $count = 10
  $tuple = Get-TextFromPairs $title $pool $count
  $text = $tuple.text
  $pairs = $tuple.pairs
  $translationFull = ($pairs | ForEach-Object { $_.pt }) -join ' '
  $obj = [ordered]@{
    title = $title
    text = $text
    translation = $translationFull
    pairs = $pairs
    vocabulary = $vocab
    grammar = (Get-Grammar $level)
    verbs = 'Verbs used: feed, check, start, clean, adjust, monitor, operate, record, assess, coordinate.'
    exercises = [ordered]@{
      multiple_choice = @(
        @{ question='What do we check every morning?'; options=@('Plants','Emails','Movies','Games'); answer=0 },
        @{ question='Which machine is for spraying?'; options=@('Sprayer','Oven','Printer','Mixer'); answer=0 },
        @{ question='What protects animals in cold weather?'; options=@('Barn','Laptop','Radio','Paint'); answer=0 },
        @{ question='What do we rotate to improve forage?'; options=@('Pastures','Books','Rooms','Shoes'); answer=0 },
        @{ question='Where do we grow plants with climate control?'; options=@('Greenhouse','Garage','Office','Kitchen'); answer=0 }
      )
      fill_in = @(
        @{ sentence='We ____ the cows every morning.'; answer='feed' },
        @{ sentence='Start the ____ carefully.'; answer='tractor' },
        @{ sentence='Check the ____ for the animals.'; answer='water' }
      )
      speaking = "Repeat: $title"
    }
  }
  return $obj
}

foreach ($lvl in $levels) {
  $dir = Join-Path $base "src/data/texts/$lvl"
  Ensure-Dir $dir
  for ($i=1; $i -le 10; $i++) {
    $file = Join-Path $dir "text$i.json"
    $obj = Get-Obj $lvl $i
    $json = $obj | ConvertTo-Json -Depth 6
    Set-Content -Path $file -Value $json -Encoding UTF8
  }
}

Write-Output 'Conteúdos gerados em /src/data/texts/<LEVEL>/text<n>.json'
