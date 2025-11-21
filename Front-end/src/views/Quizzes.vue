<template>
  <section class="page-section">
    <b-container fluid>
      <HeaderPage title="Lista de Quizzes" />

      <b-row>
        <QuizBox
          v-for="(quiz, index) in quizzes"
          :key="quiz._id"
          :idQuiz="quiz._id"
          :index="index + 1"
          :title="quiz.name"
        />
      </b-row>
    </b-container>
  </section>
</template>
<script>
import { FETCH_QUIZZES } from "@/store/quizzes/quiz.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import QuizBox from "@/components/QuizBox.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    HeaderPage,
    QuizBox
  },
  data: function() {
    return {
      quizzes: []
    };
  },
  computed: {
    ...mapGetters(["getUserLevelByPoints"]),
    ...mapGetters("auth", ["getProfile"]),
    ...mapGetters("quiz", ["getQuizzes"])
  },
  methods: {
    fetchQuizzes() {
      this.$store.dispatch(`quiz/${FETCH_QUIZZES}`).then(
        () => {
          // Admins can see all quizzes regardless of level
          if (this.getProfile.type === "admin") {
            this.quizzes = this.getQuizzes;
          } else {
            // Normal users only see quizzes up to their level
            this.quizzes = this.getQuizzes.filter(
              quiz =>
                quiz.level <=
                this.getUserLevelByPoints(this.getProfile.gamification.points)
                  .level
            );
          }
          this.quizzes.sort(this.compareLevels);
        },
        err => this.$alert(`${err.message}`, "Erro", "error")
      );
    },
    compareLevels(q1, q2) {
      if (q1.level > q2.level) return 1;
      if (q1.level < q2.level) return -1;
      else return 0;
    }
  },
  created() {
    this.fetchQuizzes();
  }
};
</script>
