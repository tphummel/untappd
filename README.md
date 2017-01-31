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
