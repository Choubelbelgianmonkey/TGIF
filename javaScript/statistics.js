var data, 
    memberList,
    statistic,
    json;

var body = document.querySelector("#loader");


if (location.pathname == "/senate-data.html" || location.pathname == "/Senate%20Attendance%20statistics.html" || location.pathname == "/Senate%20Partyl%20Loyalty.html") {
    start("https://api.propublica.org/congress/v1/113/senate/members.json");
} else {
    start("https://api.propublica.org/congress/v1/113/house/members.json");
}

//the abovefunction allow to dynamically set up the targeted json file in the function below
// kindly note the function is called in the {}, therefore the function following the conditon is calling another function
// the content of the targeted json file will be fetch below:



function start(url) { 

    fetch(url, { //url as set up on lines 3 to 7
            method: "GET",
            headers: new Headers({ 
                "X-API-Key": 'bKtSKxaOvma8xSiQfmAzDDFoHg9R79x6LUVFeben'
            })
        }).then(function (response) { 
        body.classList.add("loading");// call the ajax loader
            if (response.ok)
                return response.json();
        }).then(function (json) { 
            // VERY IMPORTANT:
            // as main VAR is here, we can and we HAVE to call all the relevant function here (VAR dont cross {})

            memberList = json.results[0].members;

            var statistic = {
                "numberOfDemocrats": calculateMember("D"),
                "numberOfRepublicans": calculateMember("R"),
                "numberOfIndependents": calculateMember("I"),

                "democratsVotingWithParty": getMemberLoyatly("D"),
                "republicansVotingWithParty": getMemberLoyatly("R"),
                "independentsVotingWithParty": getMemberLoyatly("I"),

                "10%whovoteleastoftenwiththeirpartyName": getLeastLoyalName(), // according to mentor, it is not wishable to create a string will all those value as once, better split them in one key each time
                "10%whovoteleastoftenwiththeirpartyMissedVotes": getLeastLoyalMissedVotes(),
                "10%whovoteleastoftenwiththeirpartyPercentMissedVotes": getLeastLoyalPercentMissedVotes(),

                "10%whovotemostoftenwiththeirpartyName": getMostLoyalName(),
                "10%whovotemostoftenwiththeirpartyMissedVotes": getMostLoyalMissedVotes(),
                "10%whovotemostoftenwiththeirpartyPercentMissedVotes": getMostLoyalPercentMissedVotes(),

                "10%whovoteleastoftenName": getLeastEngagedName(), 
                "10%whovoteleastoftenMissedvotes": getLeastEngagedMissedVotes(),
                "10%whovoteleastoftenName%Missedvotes": getLeastEngagedPercentMissedVotes(),

                "10%whovotemostoftenName": getMostEngagedName(),
                "10%whovotemostoftenMissedVotes": getMostEngagedMissedVotes(),
                "10%whovotemostoften%Missedvotes": getMostEngagedPercentMissedVotes(),

                "allMembers": getAllMembers(),
                "averageVoteWparty": getAverageVoteWithParty(),
            }

            var myNewViewOject = new Vue({
                el: "#app",
                data: {
                    statistic: [{
                        "numberOfDemocrats": calculateMember("D"),
                        "numberOfRepublicans": calculateMember("R"),
                        "numberOfIndependents": calculateMember("I"),

                        "democratsVotingWithParty": getMemberLoyatly("D"),
                        "republicansVotingWithParty": getMemberLoyatly("R"),
                        "independentsVotingWithParty": getMemberLoyatly("I"),

                        "10%whovoteleastoftenwiththeirpartyName": getLeastLoyalName(),
                        "10%whovoteleastoftenwiththeirpartyMissedVotes": getLeastLoyalMissedVotes(),
                        "10%whovoteleastoftenwiththeirpartyPercentMissedVotes": getLeastLoyalPercentMissedVotes(),

                        "10%whovotemostoftenwiththeirpartyName": getMostLoyalName(), 
                        "10%whovotemostoftenwiththeirpartyMissedVotes": getMostLoyalMissedVotes(),
                        "10%whovotemostoftenwiththeirpartyPercentMissedVotes": getMostLoyalPercentMissedVotes(),

                        "10%whovoteleastoftenName": getLeastEngagedName(), 
                        "10%whovoteleastoftenMissedvotes": getLeastEngagedMissedVotes(),
                        "10%whovoteleastoftenName%Missedvotes": getLeastEngagedPercentMissedVotes(),

                        "10%whovotemostoftenName": getMostEngagedName(), 
                        "10%whovotemostoftenMissedVotes": getMostEngagedMissedVotes(),
                        "10%whovotemostoften%Missedvotes": getMostEngagedPercentMissedVotes(),

                        "allMembers": getAllMembers(),
                        "averageVoteWparty": getAverageVoteWithParty(),
                    }],
                }
            });


            if (document.getElementById("not_vue")) {
                populateFirstTable(statistic)
            }


            if (document.getElementById("second_table")) { // very useful piece of code ! to remember !!!
                populateSecondTableAttendance(statistic) //  prevent a function to be triggered in all pages
            }
            if (document.getElementById("third_table")) {
                populateThirdTableAttendance(statistic)
            }
            if (document.getElementById("second_table_loyalty")) { 
                populateSecondTableLoyalty(statistic) 
            }
            if (document.getElementById("third_table_loyalty")) { 
                populateThirdTableLoyatly(statistic) 
            }
        body.classList.remove("loading"); // remove the ajax loader 


        })
    
        .catch(function (error) {
            console.log(error); //very important! allow to display error message inside the console automatically ! 
        })
}


//STATISTICS COMPUTING BEGIN HERE

function calculateMember(party) {

    var listOfMember = [] 

    for (i = 0; i < memberList.length; i++) { //looping throuhg list and dispatching each matching member to an array

        if (memberList[i].party === party) {
            listOfMember.push(memberList[i])
        }
    }
    var numberOfMember = listOfMember.length 
    

    return numberOfMember; 
  
}

function getMemberLoyatly(party) {

    var listOfMemberLoyalty = [] 

    for (i = 0; i < memberList.length; i++) {  
        if (memberList[i].party === party) { //isolating the matchingmember and pushing the proper key inside an array
            listOfMemberLoyalty.push(memberList[i].votes_with_party_pct)
        }
    }

    var sumOfLoyatly = listOfMemberLoyalty.reduce((a, b) => a + b, 0)
    // rename each member of the array a & b, where a & b are sums up, the original value is 0

    var diviseur = listOfMemberLoyalty.length === 0 ? 1 : listOfMemberLoyalty.length
    var averageOfLoyatly = sumOfLoyatly / diviseur
// the two last var have has purpose to prevent the display of NaN, as you cannot divide by 0 (JS dont allow it)

    return averageOfLoyatly.toFixed(2); 
}

// least loyal name & missed votes & % missed votes

function getLeastLoyalName() {

    var lowestTenPercent = [], 
        listOfMember = []; 


    for (i = 0; i < memberList.length; i++) { 
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        lowestTenPercent.push(
            listOfMember[j].first_name +
            " " +
            (listOfMember[j].middle_name || "") +
            " " +
            listOfMember[j].last_name)
    }



    return lowestTenPercent;
}

function getLeastLoyalMissedVotes() {

    var lowestTenPercent = [], 
        listOfMember = [] 


    for (i = 0; i < memberList.length; i++) { 
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        lowestTenPercent.push(listOfMember[j].missed_votes)
    }

    lowestTenPercent.sort(function (a, b) {
        return b - a
    })
    return lowestTenPercent;

}

function getLeastLoyalPercentMissedVotes() {


    var lowestTenPercent = [], 
        listOfMember = [] 


    for (i = 0; i < memberList.length; i++) { 
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        lowestTenPercent.push(listOfMember[j].missed_votes_pct + "%")
    }
    return lowestTenPercent;

}


// Most loyal name & missed votes & % missed votes

function getMostLoyalName() {

    var highestTenPercent = [], 
        listOfMember = [] 


    for (i = 0; i < memberList.length; i++) { 
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(
            listOfMember[j].first_name +
            " " +
            (listOfMember[j].middle_name || "") +
            " " +
            listOfMember[j].last_name)
    };

    return highestTenPercent;
}

function getMostLoyalMissedVotes() {

    var highestTenPercent = [], 
        listOfMember = [];


    for (i = 0; i < memberList.length; i++) {
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(listOfMember[j].missed_votes)
    };


    highestTenPercent.sort(function (a, b) {
        return a - b
    })
    return highestTenPercent;



}

function getMostLoyalPercentMissedVotes() {

    var highestTenPercent = [], 
        listOfMember = [] 


    for (i = 0; i < memberList.length; i++) { //looping through list and dispatching each member to an array
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct; //sorting list accordingly with votes matching their party
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(listOfMember[j].missed_votes_pct + "%")
    };

    return highestTenPercent;

}

// least engaged name & missed votes & % missed votes

function getLeastEngagedName() {

    var lowestTenPercent = [], 
        listOfMember = [];


    for (i = 0; i < memberList.length; i++) { 
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return b.missed_votes_pct - a.missed_votes_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        lowestTenPercent.push(
            listOfMember[j].first_name +
            " " +
            (listOfMember[j].middle_name || "") +
            " " +
            listOfMember[j].last_name)
    }


    return lowestTenPercent;
}

function getLeastEngagedMissedVotes() {

    var lowestTenPercent = [], 
        listOfMember = [];

    for (i = 0; i < memberList.length; i++) {
        listOfMember.push(memberList[i])
    };



    listOfMember.sort(function (a, b) {
        return b.missed_votes_pct - a.missed_votes_pct; 
    });



    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        lowestTenPercent.push(listOfMember[j].missed_votes);
    }


    lowestTenPercent.sort(function (a, b) {
        return b - a
    });
    return lowestTenPercent;


}

function getLeastEngagedPercentMissedVotes() {


    var lowestTenPercent = [],  
        listOfMember = []  


    for (i = 0; i < memberList.length; i++) { //looping through list and dispatching each member to an array
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return b.missed_votes_pct - a.missed_votes_pct; //sorting list accordingly with votes matching their party
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {

        lowestTenPercent.push(listOfMember[j].missed_votes_pct + "%");
    }
    return lowestTenPercent;

}


// Most engaged name & missed votes & % missed votes

function getMostEngagedName() {

    var highestTenPercent = [],  
        listOfMember = []  


    for (i = 0; i < memberList.length; i++) { //looping through list and dispatching each member to an array
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct; //sorting list accordingly with votes matching their party
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(
            listOfMember[j].first_name +
            " " +
            (listOfMember[j].middle_name || "") +
            " " +
            listOfMember[j].last_name)
    }
    return highestTenPercent;

}

function getMostEngagedMissedVotes() {



    var highestTenPercent = [],  
        listOfMember = []  


    for (i = 0; i < memberList.length; i++) { //looping through list and dispatching each member to an array
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct; //sorting list accordingly with votes matching their party
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(listOfMember[j].missed_votes)
    }

    highestTenPercent.sort(function (a, b) {
        return b - a
    });


    return highestTenPercent;

}

function getMostEngagedPercentMissedVotes() {

    var highestTenPercent = [],  
        listOfMember = []  


    for (i = 0; i < memberList.length; i++) { //looping through list and dispatching each member to an array
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct; //sorting list accordingly with votes matching their party
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(listOfMember[j].missed_votes_pct +
            "%")
    }
    return highestTenPercent;


}


function getAllMembers() {

    var allMember = memberList.length;

    return allMember;


}

function getAverageVoteWithParty() {
    //first: need to revert the toFixed(2), as it transform the numbers into string, making impossible to calculate the average

    var voteWpartyD = Number(getMemberLoyatly("D")),
        voteWpartyR = Number(getMemberLoyatly("R")),
        voteWpartyI = Number(getMemberLoyatly("I"));

    var averageVoteWParty = (voteWpartyD + voteWpartyR + voteWpartyI) / 3;

    return averageVoteWParty.toFixed(2);

}



//TABLE BEGIN HERE


function populateFirstTable(statistic) {

    var tbody1 = document.getElementById("first_row"), // DO NOT ADD THE ID IN A THEAD, use a TBODY instead
        row1 = tbody1.insertRow(-1), //minus one in ordert o create row from top to bottom
        cell1 = row1.insertCell(0),
        cell2 = row1.insertCell(1),
        cell3 = row1.insertCell(2);

    cell1.innerHTML = "Republicans";
    cell2.innerHTML = statistic.numberOfRepublicans;
    cell3.innerHTML = statistic.republicansVotingWithParty;

    var tbody2 = document.getElementById("second_row"),
        row2 = tbody2.insertRow(-1),
        cell4 = row2.insertCell(0),
        cell5 = row2.insertCell(1),
        cell6 = row2.insertCell(2);

    cell4.innerHTML = "Democrats";
    cell5.innerHTML = statistic.numberOfDemocrats;
    cell6.innerHTML = statistic.democratsVotingWithParty;

    var tbody3 = document.getElementById("third_row"),
        row3 = tbody3.insertRow(-1),
        cell7 = row3.insertCell(0),
        cell8 = row3.insertCell(1),
        cell9 = row3.insertCell(2);

    cell7.innerHTML = "Independent";
    cell8.innerHTML = statistic.numberOfIndependents;
    cell9.innerHTML = statistic.independentsVotingWithParty;

    var tbody4 = document.getElementById("fourth_row"),
        row4 = tbody4.insertRow(-1),
        cell10 = row4.insertCell(0),
        cell11 = row4.insertCell(1),
        cell12 = row4.insertCell(2);

    cell10.innerHTML = "Total";
    cell11.innerHTML = statistic.allMembers;
    cell12.innerHTML = statistic.averageVoteWparty;
}


function populateSecondTableAttendance(statistic) {



    var leastReliable = statistic["10%whovoteleastoftenName"],
        tbody = document.getElementById("second_table");

    tbody.innerHTML = ""; // to erase everything previously done (delte all tr & td added in HTML)
    for (i = 0;
        (i < leastReliable.length); i++) {
        var newRow = document.createElement("tr");

        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenName"][i];
        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenMissedvotes"][i];
        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenName%Missedvotes"][i];

        tbody.appendChild(newRow);
    }

}


function populateThirdTableAttendance(statistic) {

    var leastReliable = statistic["10%whovoteleastoftenName"],
        tbody = document.getElementById("third_table"); 

    tbody.innerHTML = ""; 
    for (i = 0;
        (i < leastReliable.length); i++) {
        var newRow = document.createElement("tr");

        newRow.insertCell().innerHTML = statistic["10%whovotemostoftenName"][i];
        newRow.insertCell().innerHTML = statistic["10%whovotemostoftenMissedVotes"][i];
        newRow.insertCell().innerHTML = statistic["10%whovotemostoften%Missedvotes"][i];

        tbody.appendChild(newRow);
    }

}


function populateSecondTableLoyalty(statistic) {

    var leastReliable = statistic["10%whovoteleastoftenwiththeirpartyName"],
        tbody = document.getElementById("second_table_loyalty"); 

    tbody.innerHTML = ""; 
    for (i = 0;
        (i < leastReliable.length); i++) {
        var newRow = document.createElement("tr");

        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenwiththeirpartyName"][i];
        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenwiththeirpartyMissedVotes"][i];
        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenwiththeirpartyPercentMissedVotes"][i];

        tbody.appendChild(newRow);
    }
}


function populateThirdTableLoyatly(statistic) {

    var leastReliable = statistic["10%whovotemostoftenwiththeirpartyName"],
        tbody = document.getElementById("third_table_loyalty"); 

    tbody.innerHTML = ""; 
    for (i = 0;
        (i < leastReliable.length); i++) {
        var newRow = document.createElement("tr");

        newRow.insertCell().innerHTML = statistic["10%whovotemostoftenwiththeirpartyName"][i];
        newRow.insertCell().innerHTML = statistic["10%whovotemostoftenwiththeirpartyMissedVotes"][i];
        newRow.insertCell().innerHTML = statistic["10%whovotemostoftenwiththeirpartyPercentMissedVotes"][i];

        tbody.appendChild(newRow);
    }
}