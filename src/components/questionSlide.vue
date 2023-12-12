<template>
  <div class="text-start">
    <div v-if="currentQuestion">
      <p>{{ currentQuestion.question }}</p>
      <ul class="ps-0">
        <li v-for="(option, index) in currentQuestion.options" :key="index">
          <label>
            <input
              type="radio"
              :value="option"
              v-model="selectedAnswer"
              @change="nextQuestion"
            />
            {{ option }}
          </label>
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="text-center mt-2">Thank you for answering the questions!</p>
      <!-- <p>Results:</p>
      <ul>
        <li v-for="(answer, index) in answers" :key="index">
          Question {{ index + 1 }}: {{ answer }}
        </li>
      </ul> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [
        {
          question: "What is your favorite color?",
          options: ["Red", "Blue", "Green", "Yellow"],
        },
        {
          question: "What is your favorite animal?",
          options: ["Dog", "Cat", "Elephant", "Dolphin"],
        },
        {
          question: "What is your favorite food?",
          options: ["Pizza", "Sushi", "Burger", "Pasta"],
        },
      ],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answers: [],
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
  },
  methods: {
    nextQuestion() {
      if (this.selectedAnswer) {
        this.answers.push(this.selectedAnswer);
        this.selectedAnswer = null;
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex >= this.questions.length) {
          // No more questions, display the results
          this.currentQuestionIndex = null;
        }
      }
    },
  },
};
</script>
<style scoped>
ul{
    list-style-type: none !important
}
</style>
