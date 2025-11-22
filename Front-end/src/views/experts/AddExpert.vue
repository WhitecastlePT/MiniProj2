<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Expert" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="add">
            <input type="hidden" v-model="type" value="expert" />
            <div class="form-group">
              <input
                v-model="name"
                type="text"
                class="form-control form-control-lg"
                id="txtName"
                placeholder="escreve nome"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="birth_date"
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
                v-model="location.city"
                type="text"
                class="form-control form-control-lg"
                id="txtCity"
                placeholder="escreve cidade"
              />
            </div>
            <div class="form-group">
              <input
                v-model="location.country"
                type="text"
                class="form-control form-control-lg"
                id="txtCountry"
                placeholder="escreve país"
              />
            </div>
            <!-- Hidden fields - sent as empty strings -->
            <input type="hidden" v-model="location.district" />
            <input type="hidden" v-model="auth.username" />
            <input type="hidden" v-model="auth.password" />
            <div class="form-group">
              <textarea
                id="txtDescription"
                class="form-control form-control-lg"
                placeholder="escreve descrição/observações"
                cols="30"
                rows="5"
                v-model="description"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-plus-square"></i> ADICIONAR
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
import { ADD_EXPERT } from "@/store/experts/expert.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "AddUser",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      location: { city: "", district: "", country: "" },
      auth: { username: "", password: "" },
      gamification: { points: "", quiz: "" },
      active: true,
      name: "",
      type: "expert",
      birth_date: "",
      description: ""
    };
  },
  computed: {
    ...mapGetters("expert", ["getMessage"])
  },
  methods: {
    add() {
      this.$store.dispatch(`expert/${ADD_EXPERT}`, this.$data).then(
        () => {
          this.$alert(this.getMessage, "Expert adicionado!", "success");
          router.push({ name: "listExperts" });
        },
        err => {
          this.$alertError(err);
        }
      );
    }
  }
};
</script>
