## untappd

download untappd checkin data for a user

## setup

```
git clone git@github.com:tphummel/untappd.git
cd untappd
npm install
```

## usage

```
CLIENT_ID=abc123 \
CLIENT_SECRET=def456 \
node get-checkins.js username [max_id]
  username: required, ex: 'tphummel'
  max_id: optional, ex: '10094223'
```

## data file output

```
➜  tree data            
data
└── tphummel
    ├── 2012
    │   ├── 10094223.json
    │   ├── 9591910.json
    │   ├── 9649188.json
    │   └── 9933200.json
    ├── 2015
    │   ├── 144070944.json
    │   ├── 145660558.json
    │   └── 196649977.json
    ├── 2016
    │   ├── 307672228.json
    │   ├── 307750206.json
    │   ├── 308172182.json
    │   ├── 308206058.json
    │   └── 401016918.json
    └── 2017
        ├── 401790329.json
        ├── 402595909.json
        └── 411483238.json

5 directories, 15 files

```

## example analysis

Most Checkins, Grouped by Beer, 2016
```
➜ cat data/tphummel/2016/*.json \
  | jq --slurp ".[] | (.brewery.brewery_name + \" \" + .beer.beer_name)" \
  | awk '{ FS="\n" count[$1]++}END{for(j in count) print j","count[j]}' \
  | sort -t "," -k2 -nr \
  | head -n8

"Guinness Guinness Draught",16
"Firestone Walker Brewing Company 805 Blonde",10
"Tom Hummel Homebrew Batch \"C\" Blonde Ale",9
"Tom Hummel Homebrew Batch \"B\" American Brown Ale",8
"Stella Artois Stella Artois",7
"New Belgium Brewing Company Fat Tire",5
"Deschutes Brewery Black Butte Porter",5
"Ballast Point Brewing & Spirits Watermelon Dorado",5
```

Most Checkins, Grouped by Brewery, 2016

```
➜  untappd git:(master) ✗ cat data/tphummel/2016/*.json \
  | jq --slurp ".[] .brewery.brewery_name" \
  | awk '{ FS="\n" count[$1]++}END{for(j in count) print j","count[j]}' \
  | sort -t "," -k2 -nr  

"Firestone Walker Brewing Company",27
"Guinness",25
"Tom Hummel Homebrew",17
"Stone Brewing",13
"Modern Times Beer",13
"Golden Road Brewing",13
"Ballast Point Brewing & Spirits",13
"Lagunitas Brewing Company",11
"Deschutes Brewery",10
```
## dev

```
# run linter
npm test

export CLIENT_ID=abc123
export CLIENT_SECRET=def456

# cache http requests
VCR_MODE=record node get-checkins.js tphummel

# use cache
VCR_MODE=playback node get-checkins.js tphummel
```

## notes
at time of writing, hobby api accounts are rate limited to 100 calls per hour

[untappd api v4 docs](https://untappd.com/api/docs/v4)

untappd is a solid product with an impressive database. please consider becoming a [supporter](https://untappd.com/supporter) if you are interested in features like advanced reports and data export.
