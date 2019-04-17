const store = new Vuex.Store({
  state: {
    dice: [],
    scoreCard: []
  },
  getters: {
    getOpenSlots: state => {
      return state.scoreCard.filter(item => item.value === 0);
    },

    //Hämtar enbart ut värdet från tärningarna och returnerar till ny array
    diceValues: state => {
      results = [];
      state.dice.forEach(d => {
        results.push(d.value);
      });
      return results;
    },
    //Sorterar med högsta tal först
    sortByDesDice: (state, getters) => {
      let sortedArray = [];
      sortedArray = getters.diceValues.slice().sort(function(a, b) {
        return b - a;
      });
      return sortedArray;
    },
    sortByAscDice: (state, getters) => {
      let sortedArray = [];
      sortedArray = getters.diceValues.slice().sort(function(a, b) {
        return a - b;
      });
      return sortedArray;
    },
    // Hämtar summan av num som man skickar in som inparameter. Om objektet är undefined (dvs kunde inte hittas returneras 0)
    calculateNumbers: (state, getters) => num => {
      let sum = 0;
      let aggregateObj = { number: num, count: 0 };
      let temp = {};
      temp = getters.calculateAggregate.find(d => d.number === num);
      if (typeof temp != "undefined") aggregateObj = temp;
      sum = aggregateObj.number * aggregateObj.count;
      return sum;
    },
    scoreCardValues: state => {
      let results = [];
      state.scoreCard.forEach(s => {
        results.push(s.value);
      });
      return results;
    },
    scoreCardValuesForNumbers: state => {
      let results = [];
      state.scoreCard.forEach(s => {
        if (s.id < 7) results.push(s.value);
      });
      return results;
    },
    calculateTotalScore: (state, getters) => {
      return getters.scoreCardValues.reduce(
        (partial_sum, a) => partial_sum + a
      );
    },
    calculateBonus: (state, getters) => {
      if (
        getters.scoreCardValuesForNumbers.reduce(
          (partial_sum, a) => partial_sum + a
        ) >= 63
      )
        return 50;
      else return 0;
    },
    //Räknar ut värdet på par genom att gå igenom den sorterade arrayen och se om samma tal finns efter.
    //Returnerar det talet*2 för att få fram parets värde i spelet.
    calculatePairs: (state, getters) => {
      var results = 0;
      for (var i = 0; i < getters.sortByDesDice.length - 1; i++) {
        if (getters.sortByDesDice[i + 1] == getters.sortByDesDice[i]) {
          results = getters.sortByDesDice[i];
          break;
        }
      }
      return results * 2;
    },
    calculateThreeOfAKind: (state, getters) => {
      var results = 0;
      for (var i = 0; i < getters.sortByDesDice.length - 1; i++) {
        if (
          getters.sortByDesDice[i + 1] == getters.sortByDesDice[i] &&
          getters.sortByDesDice[i + 2] == getters.sortByDesDice[i + 1]
        ) {
          results = getters.sortByDesDice[i];
          break;
        }
      }
      return results * 3;
    },
    calculateFourOfAKind: (state, getters) => {
      var results = 0;
      for (var i = 0; i < getters.sortByDesDice.length - 1; i++) {
        if (
          getters.sortByDesDice[i + 1] == getters.sortByDesDice[i] &&
          getters.sortByDesDice[i + 2] == getters.sortByDesDice[i + 1] &&
          getters.sortByDesDice[i + 3] == getters.sortByDesDice[i + 2]
        ) {
          results = getters.sortByDesDice[i];
          break;
        }
      }
      return results * 4;
    },
    calculateYatzy: (state, getters) => {
      var results = 0;
      for (var i = 0; i < getters.sortByDesDice.length - 1; i++) {
        if (
          getters.sortByDesDice[i + 1] == getters.sortByDesDice[i] &&
          getters.sortByDesDice[i + 2] == getters.sortByDesDice[i + 1] &&
          getters.sortByDesDice[i + 3] == getters.sortByDesDice[i + 2] &&
          getters.sortByDesDice[i + 4] == getters.sortByDesDice[i + 3]
        ) {
          results = 50;
          break;
        }
      }
      return results;
    },
    calculateTwoPairs: (state, getters) => {
      var results = [];
      for (var i = 0; i < getters.sortByDesDice.length - 1; i++) {
        if (getters.sortByDesDice[i + 1] == getters.sortByDesDice[i]) {
          results.push(getters.sortByDesDice[i]);
          results.push(getters.sortByDesDice[i + 1]);
        }
      }
      if (results.length > 3) {
        //Metod för att addera alla värden i results arrayen. Kollar att längden är större än 4 eller högre så vi vet att det
        //är två-par
        return results.reduce((partial_sum, a) => partial_sum + a);
      } else return 0;
    },

    calculateFullHouse: (state, getters) => {
      let aggregate = getters.calculateAggregate;
      let threeOfAKind = 0;
      let pair = 0;
      let sum = 0;
      for (let i = 0; i < aggregate.length; i++) {
        if (aggregate[i].count === 3) {
          threeOfAKind = aggregate[i].number * 3;
        }
        if (aggregate[i].count === 2) {
          pair = aggregate[i].number * 2;
        }
      }
      if (threeOfAKind > 0 && pair > 0) sum = threeOfAKind + pair;

      return sum;
    },
    //Ser om det är stege genom att kolla om nästa steg i sortarede arrayen är 1 siffra högre än den förra.
    //Kollar om stor eller liten genom att se antalet 6:or.
    calculateStraight: (state, getters) => {
      let array = getters.sortByAscDice;
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i + 1] != array[i] + 1) {
          return 0;
        }
      }
      if (getters.calculateNumbers(6) === 0) return 15;
      else return 20;
    },
    calculateChance: (state, getters) => {
      let array = getters.diceValues;
      return array.reduce((partial_sum, a) => partial_sum + a);
    },
    //Mockdata that can be used for testing functions that use aggregate
    mockdataArray: state => {
      let mockArray = [{ number: 4, count: 3 }, { number: 3, count: 2 }];
      return mockArray;
    },
    //mockarray for testing functions that are using number arrays
    mockNumberArray: state => {
      let mockArray = [2, 3, 4, 5, 6];
      return mockArray;
    },
    calculateAggregate: (state, getters) => {
      let aggregate = [];
      let current = null;
      let cnt = 0;

      for (let i = 0; i <= getters.sortByDesDice.length; i++) {
        if (getters.sortByDesDice[i] != current) {
          if (cnt > 0) {
            aggregate.push({ number: current, count: cnt });
          }
          current = getters.sortByDesDice[i];
          cnt = 1;
        } else {
          cnt++;
        }
      }
      return aggregate;
    },
    displayPossibleScores: (state, getters) => {
      for (let index = 0; index < getters.getOpenSlots.length; index++) {}
    }
  },
  mutations: {}
});

// Ska hålla actionknappsfältet
const Actions = {
  computed: {
    getOpenSlots() {
      return this.$store.getters.getOpenSlots;
    }
  },
  template: `
          <div class="action-holder">
          <div class="roll">roll</div>
          <div class="next">next</div>
          </div>
      `
};

const Header = {
  computed: {
    scoreCard() {
      return this.$store.state.scoreCard;
    },
    totalScore() {
      let sum = 0;
      for (let index = 0; index < this.scoreCard.length; index++) {
        sum += this.scoreCard[index].value;
      }
      return sum;
    }
  },
  template: `<div>Yatzy --- Score: {{totalScore}}
      </div>`
};

// Skriver ut varje tärning i tärningsfältet, ska även hålla design för tärningarna
const Die = {
  props: ["di"],
  store,
  computed: {
    classObject() {
      let idPlusOne = this.di.id + 1;
      return "di " + "di" + idPlusOne;
    },
    getDieUnicode() {
      if (this.di.value === 1) return "&#9856;";
      else if (this.di.value === 2) return "&#9857;";
      else if (this.di.value === 3) return "&#9858;";
      else if (this.di.value === 4) return "&#9859;";
      else if (this.di.value === 5) return "&#9860;";
      else if (this.di.value === 6) return "&#9861;";
      else return "";
    }
  },

  template: `<div v-bind:class="classObject" v-html="getDieUnicode">
      </div>
      `
};

//Ska skriva ut de rullade tärningarna längst ner i appen
const DiceHolder = {
  computed: {
    dice() {
      return this.$store.state.dice;
    }
  },
  methods: {
    roll(d) {
      //Kollar om tärningen är låst och om inte rollar om den, returnerar värdet på tärningen.
      if (!d.locked) {
        d.value = Math.floor(Math.random() * 6) + 1;
      }
      return d.value;
    }
  },
  template: `
    <div class="dice-holder">
            <die v-for="d in dice" v-bind:di="d" :key="d.id">{{roll(d)}}</die>
        </div>
    `,
  components: {
    die: Die
  }
};

//Ska skriva ut varje fält i scorecardet
const Item = {
  props: ["it"],
  computed: {
    classObject: function() {
      return "rw " + "rw" + this.it.id;
    }
  },
  template: `
         <div v-bind:class="classObject">
          <div class="fi">{{it.field}}</div>
          <div class="vl">{{it.value}}</div>
          </div>
      `
};

Vue.component("scoreCard", {
  computed: {
    dice() {
      return this.$store.state.dice;
    },
    scoreCard() {
      return this.$store.state.scoreCard;
    }
  },
  template: `
        <div class="score-card">
        <div class="cbvl cb1">Combo</div>
        <div class="cbvl vl1">Value</div>
        <div class="cbvl cb2">Combo</div>
        <div class="cbvl vl2">Value</div>
        <item-selector v-for="i, index in scoreCard" v-bind:it="i" :key="index"></item-selector>
        </div>    
    `,
  components: {
    "item-selector": Item
  }
});

const app = new Vue({
  store,
  el: "#app",
  methods: {
    //Lägger in 5 tärningar i vuex store
    initDice() {
      for (let index = 0; index < 5; index++) {
        store.state.dice.push({
          id: index,
          value: 0,
          locked: false
        });
      }
    },
    initScoreCard() {
      let fieldArray = [
        "ettor",
        "tvåor",
        "treor",
        "fyror",
        "femmor",
        "sexor",
        "bonus",
        "summa",
        "par",
        "två-par",
        "triss",
        "fyrtal",
        "liten-stege",
        "stor-stege",
        "kåk",
        "chans",
        "yatzy",
        "total"
      ];
      for (let index = 0; index < fieldArray.length; index++) {
        let indexPlusOne = index + 1;
        store.state.scoreCard.push({
          id: indexPlusOne,
          field: fieldArray[index],
          value: 0
        });
      }
    }
  },
  //Kör när vuen skapas
  mounted() {
    this.initDice();
    this.initScoreCard();
  },
  components: {
    "dice-holder": DiceHolder,
    "action-holder": Actions,
    "header-holder": Header
  }
});
