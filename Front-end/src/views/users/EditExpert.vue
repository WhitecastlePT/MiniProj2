<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Expert" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="update">
            <input type="hidden" v-model="expert.type" value="expert" />
            <div class="form-group">
              <input
                v-model="expert.name"
                type="text"
                class="form-control form-control-lg"
                id="txtName"
                placeholder="escreve nome"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="expert.birth_date"
                type="text"
                onmouseenter="(this.type='date')"
                onmouseleave="(this.type='text')"
                class="form-control form-control-lg"
                id="txtBirthDate"
                placeholder="escreve data de nascimento"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="expert.location.city"
                type="text"
                class="form-control form-control-lg"
                id="txtCity"
                placeholder="escreve cidade"
              />
            </div>
            <div class="form-group">
              <input
                v-model="expert.location.country"
                type="text"
                class="form-control form-control-lg"
                id="txtCountry"
                placeholder="escreve país"
              />
            </div>
            <!-- Hidden district field - sent as empty string or existing value -->
            <input type="hidden" v-model="expert.location.district" />
            <div class="form-group">
              <textarea
                id="txtDescription"
                class="form-control form-control-lg"
                placeholder="escreve descrição/observações"
                cols="30"
                rows="5"
                v-model="expert.description"
              ></textarea>
            </div>

            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-edit"></i> ATUALIZAR
            </button>
            <router-link
              :to="{ name: 'listExperts' }"
              tag="button"
              class="btn btn-outline-danger btn-lg"
            >
              <i class="fas fa-window-close"></i> CANCELAR
            </router-link>
          </form>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { EDIT_EXPERT, FETCH_EXPERTS } from "@/store/experts/expert.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "EditExpert",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      expert: {
        location: {}
      }
    };
  },
  computed: {
    ...mapGetters("expert", ["getExpertsById", "getMessage"])
  },
  methods: {
    update() {
      this.$store.dispatch(`expert/${EDIT_EXPERT}`, this.$data.expert).then(
        () => {
          this.$alert(this.getMessage, "Expert atualizado!", "success");
          router.push({ name: "listExperts" });
        },
        err => {
          this.$alertError(err);
        }
      );
    },
    fetchExpert() {
      this.$store.dispatch(`expert/${FETCH_EXPERTS}`).then(
        () => {
          const expert = this.getExpertsById(this.$route.params.expertId);
          if (expert) {
            this.expert = expert;
          } else {
            this.$alert("Expert não encontrado!", "Erro", "error");
            router.push({ name: "listExperts" });
          }
        },
        err => {
          this.$alertError(err);
        }
      );
    }
  },
  created() {
    this.fetchExpert();
  }
};
</script>
