class Scale {
    static notesMap = new Map();
    static scalesMap = new Map();
    rootNoteKeyDouble;
    scaleNameString;
    scaleNotes = [];    
    
    constructor(scaleString, rootNoteKeyDouble){
        Scale.initializeNotesMap();
        Scale.initializeScalesMap();
        this.scaleNameString = 'Ionisch';
        this.rootNoteKeyDouble = 1.0;
    }

    static initializeNotesMap(){
        Scale.notesMap.set(1.0, 'C');
        Scale.notesMap.set(1.5, 'C#');
        Scale.notesMap.set(2.0, 'D');
        Scale.notesMap.set(2.5, 'D#');
        Scale.notesMap.set(3.0, 'E');
        Scale.notesMap.set(3.5, 'F');
        Scale.notesMap.set(4.0, 'F#');
        Scale.notesMap.set(4.5, 'G');
        Scale.notesMap.set(5.0, 'G#');
        Scale.notesMap.set(5.5, 'A');
        Scale.notesMap.set(6.0, 'A#');
        Scale.notesMap.set(6.5, 'H');
    }
    
    
    static initializeScalesMap(){
        Scale.scalesMap.set('Ionisch', [7,2,6]);
        Scale.scalesMap.set('Dorisch', [7,1,5]);
        Scale.scalesMap.set('Phrygisch', [7,0,4]);
        Scale.scalesMap.set('Lydisch', [7,3,7]);
        Scale.scalesMap.set('Mixolydisch', [7,2,5]);
        Scale.scalesMap.set('Äolisch', [7,1,4]);
        Scale.scalesMap.set('Lokrisch', [7,0,3]);
        Scale.scalesMap.set('DurPentatonik',[7,2,6]);
        Scale.scalesMap.set('MolPentatonik',[7,1,4]);
    }
    
    calculateScale(){
        let noteKeyDouble = this.rootNoteKeyDouble;
        let lenghtOfScale = Scale.scalesMap.get(this.scaleNameString).at(0);
        let halfSteps = Scale.scalesMap.get(this.scaleNameString).slice(1,lenghtOfScale);
        let scaleNotesString = '';
        this.scaleNotes = [];
        for (let i=0; i<lenghtOfScale; i++){
            if(!(this.scaleNameString=='DurPentatonik' && (i==3 || i==6)) && !(this.scaleNameString=='MolPentatonik' && (i==1 || i==5))){
            scaleNotesString = scaleNotesString.concat(Scale.notesMap.get(noteKeyDouble),' | '); 
            this.scaleNotes.push([noteKeyDouble, Scale.notesMap.get(noteKeyDouble)]);
            }
            if(halfSteps.includes(i)){
                    noteKeyDouble += 0.5;
                }
                else{
                    noteKeyDouble +=1.0;
                }
                if(noteKeyDouble >= lenghtOfScale){
                    noteKeyDouble -= lenghtOfScale-1;
                }
        }
        return scaleNotesString;
    }

    setAndCalculateRandomScale(){
        let scaleKeyArray = Array.from(Scale.scalesMap.keys());
        let noteKeyArray = Array.from(Scale.notesMap.keys());
        this.scaleNameString = scaleKeyArray.at(Math.floor(Math.random()*scaleKeyArray.length));
        this.rootNoteKeyDouble = noteKeyArray.at(Math.floor(Math.random() * noteKeyArray.length))
        return this.calculateScale();  
    }

    getRootNoteKeyDouble() {
        return this.rootNoteKeyDouble;
    }
    setRootNoteKeyDouble(rootNoteKeyDouble) {
        this.rootNoteKeyDouble = rootNoteKeyDouble;
    }
    getScaleNameString() {
        return this.scaleNameString;
    }
    setScaleNameString(scaleNameString) {
        this.scaleNameString = scaleNameString;
    }
    getScaleNotes() {
        return this.scaleNotes;
    }
    setScaleNotes(scaleNotes) {
        this.scaleNotes = scaleNotes;
    }
    static getNotesMap() {
        return Scale.notesMap;
    }
    static setNotesMap(notesMap) {
        Scale.notesMap = notesMap;
    }
    static getScalesMap() {
        return Scale.scalesMap;
    }
    static setScalesMap(scalesMap) {
        Scale.scalesMap = scalesMap;
    }
}

class ScaleView {
    static calculateScaleButton = document.getElementById('calculateScale');
    randomScaleButton;
    static scalesSelectbox = document.getElementById('selectedScales');
    static notesSelectbox = document.getElementById('selectedNotes');
    static scaleTextView = document.getElementById('scaleTextView');
    static scaleClass = new Scale();
    static noteColorMap = new Map();
    static showScaleBoolean = false;
    
    constructor(){
        this.initializeNoteColorMap();
        ScaleView.scalesSelectbox.onchange = function(){
            ScaleView.scaleClass.setScaleNameString(this.value);
            if(ScaleView.showScaleBoolean){
                ScaleView.showScale();
            }
        };
        
        ScaleView.notesSelectbox.onchange = function(){
            ScaleView.scaleClass.rootNoteKeyDouble = parseFloat(this.value);
            if(ScaleView.showScaleBoolean){
                ScaleView.showScale();
            }
        };
        
        ScaleView.calculateScaleButton.addEventListener('click', function(){
            if(ScaleView.showScaleBoolean){
                ScaleView.hideScale();
                ScaleView.showScaleBoolean = false;
            }
            else{
                ScaleView.showScale();
                ScaleView.showScaleBoolean = true;
            }

        })
        this.randomScaleButton = document.getElementById('randomScale');
        this.randomScaleButton.addEventListener('click', function(){
            
            let scaleString = ScaleView.scaleClass.setAndCalculateRandomScale();
            if(ScaleView.showScaleBoolean){
                ScaleView.scaleTextView.innerText = scaleString;
                ScaleView.highlightKeyboardNotes();
            }
            ScaleView.scalesSelectbox.value = ScaleView.scaleClass.getScaleNameString();
            ScaleView.notesSelectbox.value = ScaleView.scaleClass.rootNoteKeyDouble;
        })
    }

    static showScale(){
        ScaleView.scaleTextView.innerText = ScaleView.scaleClass.calculateScale();
        ScaleView.highlightKeyboardNotes();
        document.getElementById('showScaleLabel').innerText = 'Hide Scale';
        
    }

    static hideScale(){
        ScaleView.scaleTextView.innerText = '';
        ScaleView.resetKeyboardNotes();
        document.getElementById('showScaleLabel').innerText = 'Show Scale';
    }
    
    static highlightKeyboardNotes(){
        ScaleView.resetKeyboardNotes();

        //Marks notes in scale
        let rootNoteKeyDouble = ScaleView.scaleClass.scaleNotes[0][0];
        
        ScaleView.scaleClass.scaleNotes.forEach(eachNote => {
            //c1 - h2 H=6.5 c1=1 d1<c1
           if(rootNoteKeyDouble <= eachNote[0]){
            document.getElementById(eachNote[1].concat("1")).style.fill = '#21BF75';//ScaleView.noteColorMap.get(eachNote);
           }
           else{
            document.getElementById(eachNote[1].concat("2")).style.fill = '#21BF75';//ScaleView.noteColorMap.get(eachNote);
           }
        });
    }

    static resetKeyboardNotes(){
        Scale.notesMap.forEach((eachNote, eachKey) => {
            let fill = '#ffffff';
            if([1.5, 2.5, 4, 5, 6].includes(eachKey)){
                fill = '#000000';   
            }
            document.getElementById(eachNote.concat("1")).style.fill = fill;
            document.getElementById(eachNote.concat("2")).style.fill = fill;
        });
    }


    initializeNoteColorMap(){
        ScaleView.noteColorMap.set('C','#F26B8F');
        ScaleView.noteColorMap.set('C#','#F1A7F2');
        ScaleView.noteColorMap.set('D','#A2F2E4');
        ScaleView.noteColorMap.set('D#','#F2B705');
        ScaleView.noteColorMap.set('E','#F28705');
        ScaleView.noteColorMap.set('F','#014040');
        ScaleView.noteColorMap.set('F#','#1BA673');
        ScaleView.noteColorMap.set('G','#21BF75');
        ScaleView.noteColorMap.set('G#','#F2EFBB');
        ScaleView.noteColorMap.set('A','#F29991');
        ScaleView.noteColorMap.set('A#','#B57114');
        ScaleView.noteColorMap.set('H','#962B09');
      }
}



new ScaleView();
