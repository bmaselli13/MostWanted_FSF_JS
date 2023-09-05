
function app(people) {
    displayWelcome();
    runSearchAndMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchAndMenu(people) {
    const searchResults = searchPeopleDataSet(people);
    console.log("Search results:", searchResults);

    if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }
    else {
        alert('No one was found in the search.');
    }

    return searchResults;
}

function searchPeopleDataSet(people) {
    console.log("Running searchPeopleDataSet...");

    const searchTypeChoice = validatedPrompt(
        'Please enter in what type of search you would like to perform.',
        ['id', 'name', 'traits']
    );

    console.log("Search type choice:", searchTypeChoice);

    let results = [];
    switch (searchTypeChoice) {
        case 'id':
            results = searchById(people);
            break;
        case 'name':
            results = searchByName(people);
            break;
        case 'traits':
            results = searchByTraits(people); 
            break;
        default:
            console.log("Invalid search type choice:", searchTypeChoice);
            results = []; 
            break;
    }

    console.log("Search results:", results);
    return results;
}

function searchById(people) {
    const idToSearchForString = prompt('Please enter the id of the person you are searching for.');
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the the first name of the person you are searching for.');
    const lastNameToSearchFor = prompt('Please enter the the last name of the person you are searching for.');
    const fullNameSearchResults = people.filter(person => (person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() && person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()));
    return fullNameSearchResults;
}

function searchByTraits(people) {
    const traitToSearch = validatedPrompt(
        'Please enter the trait you want to search for (e.g., eyeColor, occupation, etc.):',
        ['eyeColor', 'occupation', 'gender', 'other_trait']
    ).toLowerCase(); 

    const valueToSearchFor = prompt(`Please enter the ${traitToSearch} you are searching for:`).toLowerCase();

    const results = people.filter(person => {
        const personTrait = person[traitToSearch] ? person[traitToSearch].toLowerCase() : null;
        return personTrait === valueToSearchFor;
    });

    if (results.length > 0) {
        displayPeople(`Search Results for ${traitToSearch}=${valueToSearchFor}`, results);
    } else {
        alert(`No matching people found for ${traitToSearch}=${valueToSearchFor}.`);
    }

    return results; 
}



function mainMenu(person, people) {
    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, descendants, search by trait, or quit?`,
        ['info', 'family', 'descendants', 'trait', 'quit'] 
    );

    switch (mainMenuUserActionChoice) {
        case "info":            
            displayPersonInfo(person);
            break;
        case "family":
            displayFamilyInfo(person, people); 
            break;
        case "descendants":            
            displayDescendantsInfo(person, people);
            break;
        case "trait":            
            const traitResults = searchByTraits([person]); 
            displayPeople('Trait Search Results', traitResults);
            break;
        case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
    }
} 

function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function displayFamilyInfo(person, people) {
    const familyMembers = findImmediateFamily(person, people);
    const formattedFamilyDisplayText = familyMembers.map(member => `${member.relation}: ${member.firstName} ${member.lastName}`).join('\n');
    alert(`Immediate Family Members:\n\n${formattedFamilyDisplayText}`);
}

function findImmediateFamily(person, people) {
    const familyMembers = [];

    
    if (person.currentSpouse) {
        const spouse = people.find(p => p.id === person.currentSpouse);
        if (spouse) {
            familyMembers.push({ relation: 'Spouse', ...spouse });
        }
    }
    
    const parents = people.filter(p => person.parents.includes(p.id));
    parents.forEach(parent => familyMembers.push({ relation: 'Parent', ...parent }));

    
    const siblings = people.filter(p => p.parents.includes(...person.parents) && p.id !== person.id);
    siblings.forEach(sibling => familyMembers.push({ relation: 'Sibling', ...sibling }));

    return familyMembers;
}

function displayPersonInfo(person) {
    const info = `
        ID: ${person.id}
        Name: ${person.firstName} ${person.lastName}
        Gender: ${person.gender}
        Date of Birth: ${person.dob}
        Height: ${person.height} inches
        Weight: ${person.weight} lbs
        Eye Color: ${person.eyeColor}
        Occupation: ${person.occupation}
    `;
    
    alert(info);
}


function validatedPrompt(message, acceptableAnswers) {
    acceptableAnswers = acceptableAnswers.map(aa => aa.toLowerCase());

    const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')}`;

    const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

    if (acceptableAnswers.includes(userResponse)) {
        return userResponse;
    }
    else {
        alert(`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')} \n\nPlease try again.`);
        return validatedPrompt(message, acceptableAnswers);
    }
}

function exitOrRestart(people) {
    const userExitOrRestartChoice = validatedPrompt(
        'Would you like to exit or restart?',
        ['exit', 'restart']
    );

    switch (userExitOrRestartChoice) {
        case 'exit':
            return;
        case 'restart':
            return app(people);
        default:
            alert('Invalid input. Please try again.');
            return exitOrRestart(people);
    }

}