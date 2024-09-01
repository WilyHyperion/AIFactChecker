
import Ds from 'deepspeech';

const model_load_start = process.hrtime();
let model = new Ds.Model();
let audio = 
model.Model.call