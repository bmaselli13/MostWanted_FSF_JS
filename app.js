
function app(people) {
    displayWelcome();
    runSearchAndMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
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
        ['id', 'name', 'traits', 'multi_trait']
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
        case 'multi_trait':
            results = searchByMultipleTraits(people)
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

function searchByMultipleTraits(people) {
    let results = [...people];

    while (results.length > 1) {
        console.log("Inside loop. Current number of results:", results.length);

        if (results.length === 0) {
            alert(`No matching people found for the specified traits.`);
            break;
        }

        if (results.length === 1) {
            displayPeople(`Search Results for Multiple Traits`, results);
            break;
        }

        const traitToSearch = validatedPrompt(
            `Please enter the trait you want to search for (e.g., eyeColor, occupation, etc.):\nType 'done' if you are finished.`,
            ['eyeColor', 'occupation', 'gender', 'other_trait', 'done']
        ).toLowerCase(); 

        if (traitToSearch === 'done') {
            break;
        }

        console.log("Trait to search:", traitToSearch);

        const valueToSearchFor = prompt(`Please enter the ${traitToSearch} you are searching for:`).toLowerCase();

        console.log("Value to search for:", valueToSearchFor);

        results = results.filter(person => {
            const personTrait = person[traitToSearch] ? person[traitToSearch].toLowerCase() : null;
            return personTrait === valueToSearchFor;
        });
    }

    if (results.length === 1) {
        displayPeople(`Search Results for Multiple Traits`, results);
    } else if (results.length === 0) {
        alert(`No matching people found for the specified traits.`);
    } else {
        alert(`No further filtering needed. ${results.length} people matched the specified traits.`);
    }
}


function mainMenu(person, people) {
    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, descendants, search by trait, search by multiple traits, or quit?`,
        ['info', 'family', 'descendants', 'trait', 'multi_trait', 'quit']
    );

    console.log("User selected choice:", mainMenuUserActionChoice); // Add this line

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
            searchByTraits(people);
            break;
        case "multi_trait":
            searchByMultipleTraits(people);
            break;
        case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
    }
}




function searchByMultipleTraits(people) {
    let results = [...people];

    while (results.length > 1) {
        console.log("Inside loop. Current number of results:", results.length);

        const traitToSearch = validatedPrompt(
            `Please enter the trait you want to search for (e.g., eyeColor, occupation, etc.):\nType 'done' if you are finished.`,
            ['eyeColor', 'occupation', 'gender', 'other_trait', 'done']
        ).toLowerCase(); 

        if (traitToSearch === 'done') {
            break;
        }

        console.log("Trait to search:", traitToSearch);

        const valueToSearchFor = prompt(`Please enter the ${traitToSearch} you are searching for:`).toLowerCase();

        console.log("Value to search for:", valueToSearchFor);

        results = results.filter(person => {
            const personTrait = person[traitToSearch] ? person[traitToSearch].toLowerCase() : null;
            return personTrait === valueToSearchFor;
        });

        if (results.length === 0) {
            alert(`No matching people found for the specified traits.`);
            break;
        }
    }

    if (results.length === 1) {
        displayPeople(`Search Results for Multiple Traits`, results);
    } else if (results.length === 0) {
        alert(`No matching people found for the specified traits.`);
    } else {
        alert(`No further filtering needed. ${results.length} people matched the specified traits.`);
    }
}

function displayDescendantsInfo(person, people) {
    const descendants = findDescendants(person, people);
    const formattedDescendantsDisplayText = descendants.map(descendant => `${descendant.firstName} ${descendant.lastName}`).join('\n');
    alert(`Descendants:\n\n${formattedDescendantsDisplayText}`);
}

function findDescendants(person, people) {
    const descendants = [];

    const children = people.filter(p => p.parents.includes(person.id));
    children.forEach(child => {
        descendants.push(child);
        const grandchildren = findDescendants(child, people);
        descendants.push(...grandchildren);
    });

    return descendants;
}

function displayFamilyInfo(person, people) {
    const familyMembers = findFamilyMembers(person, people);
    const formattedFamilyDisplayText = familyMembers.map(member => `${member.firstName} ${member.lastName}`).join('\n');
    alert(`Family Members:\n\n${formattedFamilyDisplayText}`);
}

function findFamilyMembers(person, people) {
    const familyMembers = [];

    const parents = people.filter(p => p.children && p.children.includes(person.id));

    parents.forEach(parent => {
        familyMembers.push(parent);
        const siblings = findSiblings(parent, people);
        familyMembers.push(...siblings);
    });

    const children = people.filter(p => p.parents && p.parents.includes(person.id));
    familyMembers.push(...children);

    return familyMembers;
}

function findSiblings(person, people) {
    const siblings = [];

    const parents = people.filter(p => p.children.includes(person.id) && p.id !== person.id);
    parents.forEach(parent => {
        const parentSiblings = people.filter(p => p.children.includes(parent.id) && p.id !== person.id && !siblings.includes(p));
        siblings.push(...parentSiblings);
    });

    return siblings;
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