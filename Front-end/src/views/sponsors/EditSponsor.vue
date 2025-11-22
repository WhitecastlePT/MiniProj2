<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Sponsor" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="update">
            <input type="hidden" v-model="sponsor.type" value="sponsor" />
            <div class="form-group">
              <input
                v-model="sponsor.name"
                type="text"
                class="form-control form-control-lg"
                id="txtName"
                placeholder="escreve nome"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="sponsor.birth_date"
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
                v-model="sponsor.location.city"
                type="text"
                class="form-control form-control-lg"
                id="txtCity"
                placeholder="escreve cidade"
              />
            </div>
            <div class="form-group">
              <input
                v-model="sponsor.location.country"
                type="text"
                class="form-control form-control-lg"
                id="txtCountry"
                placeholder="escreve país"
              />
            </div>
            <!-- Hidden district field - sent as empty string or existing value -->
            <input type="hidden" v-model="sponsor.location.district" />
            <div class="form-group">
              <textarea
                id="txtDescription"
                class="form-control form-control-lg"
                placeholder="escreve descrição/observações"
                cols="30"
                rows="5"
                v-model="sponsor.description"
              ></textarea>
            </div>

            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-edit"></i> ATUALIZAR
            </button>
            <router-link
              :to="{ name: 'listSponsors' }"
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
import {
  EDIT_SPONSOR,
  FETCH_SPONSORS
} from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "EditSponsor",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      sponsor: {
        location: {}
      }
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getSponsorsById", "getMessage"])
  },
  methods: {
    update() {
      this.$store.dispatch(`sponsor/${EDIT_SPONSOR}`, this.$data.sponsor).then(
        () => {
          this.$alert(this.getMessage, "Sponsor atualizado!", "success");
          router.push({ name: "listSponsors" });
        },
        err => {
          this.$alertError(err);
        }
      );
    },
    fetchSponsor() {
      this.$store.dispatch(`sponsor/${FETCH_SPONSORS}`).then(
        () => {
          const sponsor = this.getSponsorsById(this.$route.params.sponsorId);
          if (sponsor) {
            this.sponsor = sponsor;
          } else {
            this.$alert("Sponsor não encontrado!", "Erro", "error");
            router.push({ name: "listSponsors" });
          }
        },
        err => {
          this.$alertError(err);
        }
      );
    }
  },
  created() {
    this.fetchSponsor();
  }
};
</script>
