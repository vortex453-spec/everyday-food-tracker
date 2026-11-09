const fs=require('fs');const core=fs.readFileSync(__dirname+'/src/core.js','utf8');
fs.writeFileSync(__dirname+'/dist/everyday-food-tracker.html',fs.readFileSync(__dirname+'/src/app.html','utf8').replace('/*CORE*/',()=>core));console.log('built');
