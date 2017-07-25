function secretArchivesLock(lock, actions) {
    let rotateRight = (state) => 
        state.reduceRight((prevState, currRow) => {
            currRow.split('').forEach((char, index) => 
                prevState[index] = prevState[index] ? prevState[index].concat(char) : char
            )
            return prevState;
        }, []);
    
    let shiftLeft = (state) =>
        state.map((row) => row.replace(/\./g, '').padEnd(row.length, '.'));
    
    let shiftRight = (state) =>
        state.map((row) => row.replace(/\./g, '').padStart(row.length, '.'));
    
    let executeAction = {
        "U": (state) => {
            state = rotateRight(state);
            state = shiftRight(state);
            return rotateRight(rotateRight(rotateRight(state)));
        },
        "D": (state) => {
            state = rotateRight(state);
            state = shiftLeft(state);
            return rotateRight(rotateRight(rotateRight(state)));
        },
        "L": (state) => shiftLeft(state),
        "R": (state) => shiftRight(state)
    };
    
    [... actions].forEach((action) => {
        lock = executeAction[action](lock);
    });
    
    return lock;
}