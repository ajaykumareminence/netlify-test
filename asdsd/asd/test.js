import { Country } from "../../models/Country.js";
import { State } from "../../models/State.js";
import json from "./countries.json" assert {type: 'json'};

for(const x of json.countries){
    const c = await Country.create({ name: x.country });
    for(const y of x.states){
        await State.create({ country_id: c.id, name: y })
    }
    console.log("storing ===>>")
}