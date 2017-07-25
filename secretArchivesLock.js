function secretArchivesLock(lock, actions) {
    //Reduce the instruction set, improve performance.
    let reducedActions = actions
                            .replace(/(L(L)+|(L|R)+L)/g, 'L')
                            .replace(/(R(R)+|(L|R)+R)/g, 'R')
                            .replace(/(U(U)+|(D|U)+U)/g, 'U')
                            .replace(/(D(D)+|(U|D)+D)/g,'D');
    
    //Rotate the matrix 90 degrees clockwise
    const rotateRight = (lockState) => 
        lockState.reduceRight((newState, currRow) => {
            [...currRow].forEach((char, index) => 
                newState[index] = (newState[index]) ? newState[index].concat(char) : char
            );
            return newState;
        }, []);
    
    //Rotate the matrix 90 degrees counter-clockwise
    const rotateLeft = (lockState) => 
        lockState.reduce((newState, currRow) => {
            [...currRow].forEach((char, index) => 
                newState[index] = (newState[index]) ? newState[index].concat(char) : char
            );
            return newState;
        }, []).reverse();
    
    //Shift cells in the current orientation left or right
    const emptyCells = (char) => char == '.';
    const occupiedCells = (char) => char != '.';
    
    const shiftLeft = (lockState) =>
        lockState.map((row) =>
            [...row].filter(occupiedCells).concat([...row].filter(emptyCells)).join('')
        );
    
    const shiftRight = (lockState) =>
        lockState.map((row) => 
            [...row].filter(emptyCells).concat([...row].filter(occupiedCells)).join('')
        );
    
    //Define behavior for each action
    const executeAction = {
        "U": (lockState) => {
            lockState = rotateRight(lockState);
            lockState = shiftRight(lockState);
            return rotateLeft(lockState);
        },
        "D": (lockState) => {
            lockState = rotateRight(lockState);
            lockState = shiftLeft(lockState);
            return rotateLeft(lockState);
        },
        "L": (lockState) => shiftLeft(lockState),
        "R": (lockState) => shiftRight(lockState)
    };

    //Execute all actions in sequence
    let newLock = lock;
    [... reducedActions].forEach((action) => {
        newLock = executeAction[action](newLock);
    });
    
    return newLock;
}