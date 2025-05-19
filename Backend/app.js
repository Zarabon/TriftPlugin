const express = require('express');
const cors = require('cors');
const { createYoga } = require('graphql-yoga');
const {makeExecutableSchema} = require('@graphql-tools/schema');

const app = express()
const port = 4000

const data =
    {
        "bewohner": [{
            "id": "B0001",
            "rolle": "Bewohner",
            "vorname": "Susanne",
            "nachname": "Müller",
            "geschlecht": "Weiblich",
            "religion": "keine",
            "telefonnummer": "+49 15201788987",
            "AGBsUnterschrieben": true,
            "versicherung": {
                "name": "TKK",
                "versicherungsnummer": "tkk0815SuMueller"
            },
            "notfall": {
                "blutgruppe": "0+",
                "allergien": "Mais, Knoblauch",
                "notfallkontakt": {
                    "id": "NK0011",
                    "rolle": "",
                    "vorname": "Sören",
                    "nachname": "Müller",
                    "geschlecht": "Männlich",
                    "religion": "",
                    "telefonnummer": "+49 15201788987"
                },
                "hausarzt": {
                    "id": "A0002",
                    "rolle": "Arzt",
                    "vorname": "Moritz",
                    "nachname": "Hempel",
                    "geschlecht": "Männlich",
                    "religion": "",
                    "telefonnummer": "+49 0201112254"
                }
            },
            "pPlan": [
                {
                    "datum": "01.01.2022 00:00",
                    "notwendigePflege": "Keine",
                    "diaet": "Carnivor",
                    "diaetenAnmerkungen": "",
                    "pNotiz": [
                        {
                            "datum": "01.01.2022 09:00",
                            "gemuetsZustand": 5,
                            "appetit": 7,
                            "beweglichkeit": 5,
                            "durchgefuehrtePflege": "Morgenwäsche",
                            "verabreichteMedikamente": ""
                        },
                        {
                            "datum": "01.01.2022 19:00",
                            "gemuetsZustand": 7,
                            "appetit": 6,
                            "beweglichkeit": 5,
                            "durchgefuehrtePflege": "Abendwäsche",
                            "verabreichteMedikamente": ""
                        }
                    ]
                },
                {
                    "datum": "01.06.2023 00:00",
                    "notwendigePflege": "Essensunterstützung",
                    "diaet": "Carnivor",
                    "diaetenAnmerkungen": "",
                    "pNotiz": [
                        {
                            "datum": "01.06.2023 09:00",
                            "gemuetsZustand": 7,
                            "appetit": 3,
                            "beweglichkeit": 2,
                            "durchgefuehrtePflege": "Morgenwäsche, Unterstützung beim Frühstück",
                            "verabreichteMedikamente": ""
                        },
                        {
                            "datum": "01.06.2023 19:00",
                            "gemuetsZustand": 7,
                            "appetit": 3,
                            "beweglichkeit": 2,
                            "durchgefuehrtePflege": "Abendwäsche, Unterstützung beim Abendessen",
                            "verabreichteMedikamente": "Temazepam"
                        }
                    ]
                }
            ],
            "kAkte": [
                {
                    "datum": "01.01.2022 10:10",
                    "befund": "Keine Auffälligkeiten, guter Gesundheitszustand",
                    "privateNotiz": "Patientin ist ein wenig störrisch",
                    "digitaleSignatur": "SigniertVonDrHempel"
                },
                {
                    "datum": "16.12.2022 14:11",
                    "befund": "Patientin klagt über Schlafprobleme, Verschreibung von Schlafmedikamenten",
                    "privateNotiz": "Patientin wirkt sehr müde, ist dafür nicht mehr störrisch.",
                    "digitaleSignatur": "SigniertVonDrHempel"
                }
            ]
        }]
    }


const typeDefs = `
type KAkte {
  datum: String
  befund: String
  privateNotiz: String
  digitaleSignatur: String
}

type PNotiz {
  datum: String
  gemuetsZustand: Int
  appetit: Int
  beweglichkeit: Int
  durchgefuehrtePflege: String
  verabreichteMedikamente: String
}

type PPlan {
  datum: String
  notwendigePflege: String
  diaet: String
  diaetenAnmerkungen: String
  pNotiz: [PNotiz]
}

type Hausarzt {
  id: String
  rolle: String
  vorname: String
  nachname: String
  geschlecht: String
  religion: String
  telefonnummer: String
}

type Notfallkontakt {
  id: String
  rolle: String
  vorname: String
  nachname: String
  geschlecht: String
  religion: String
  telefonnummer: String
}

type Notfall {
  blutgruppe: String
  allergien: String
  hausarzt: Hausarzt
  notfallkontakt: Notfallkontakt
}

type Versicherung {
  name: String
  versicherungsnummer: String
}

type Bewohner {
  id: String
  rolle: String
  vorname: String
  nachname: String
  geschlecht: String
  religion: String
  telefonnummer: String
  AGBsUnterschrieben: Boolean
  kAkte: [KAkte]
  pPlan: [PPlan]
  notfall: Notfall
  versicherung: Versicherung
}
type Query {
    bewohner: [Bewohner]
}
`

const resolvers = {
    Query: {
        bewohner: (obj, args, context) => context.bewohner,
    },
}

const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(
    '/graphql',
    createYoga({
        schema: executableSchema,
        context: data,
        graphiql: true,
    })
)

app.listen(port, () => {
    console.log(`Running a server at http://localhost:${port}`)
})
