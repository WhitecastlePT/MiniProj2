<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Sponsors" />

      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="1"></b-col>
        <b-col>
          <router-link
            :to="{ name: 'addSponsor' }"
            tag="button"
            class="btn btn-outline-success mr-2 mt-2"
            ><i class="fas fa-plus-square"></i> ADICIONAR SPONSOR</router-link
          >
          <router-link
            :to="{ name: 'admin' }"
            tag="button"
            class="btn btn-outline-info mr-2 mt-2"
            ><i class="fas fa-bars"></i> MENU PRINCIPAL</router-link
          >
        </b-col>
        <b-col cols="1"></b-col>
      </b-row>

      <!-- TABELA -->
      <b-row>
        <b-col cols="1"></b-col>
        <b-col>
          <table class="table table-striped">
            <thead class="thead-dark">
              <tr>
                <th scope="col">
                  NOME
                  <i
                    class="fas fa-arrow-up"
                    v-if="sortType === 1"
                    @click="sort()"
                  ></i>
                  <i class="fas fa-arrow-down" v-else @click="sort()"></i>
                </th>
                <th scope="col">TIPO</th>
                <th scope="col">DATA DE CRIAÇÃO</th>
                <th scope="col">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user of users" :key="user._id">
                <td class="pt-4">{{ user.name || "N/A" }}</td>
                <td class="pt-4">{{ getTypeLabel(user.type) || "N/A" }}</td>
                <td class="pt-4">{{ formatDate(user.registration_date) }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'editSponsor',
                      params: { sponsorId: user._id }
                    }"
                    tag="button"
                    class="btn btn-outline-success mr-2"
                    ><i class="fas fa-edit"></i> EDITAR</router-link
                  >
                  <button
                    @click="viewUser(user._id)"
                    type="button"
                    class="btn btn-outline-success mr-2"
                  >
                    <i class="fas fa-search"></i> VER
                  </button>
                  <button
                    @click="removeUser(user._id)"
                    type="button"
                    class="btn btn-outline-danger mr-2"
                  >
                    <i class="fas fa-trash-alt"></i> REMOVER
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
        <b-col cols="1"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import {
  FETCH_SPONSORS,
  REMOVE_SPONSOR
} from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";

export default {
  name: "ManageUsers",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      users: [],
      sortType: 1
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getSponsors", "getMessage"])
  },
  methods: {
    fetchUsers() {
      this.$store.dispatch(`sponsor/${FETCH_SPONSORS}`).then(
        () => {
          this.users = this.getSponsors;
        },
        err => {
          this.$alertError(err);
        }
      );
    },
    sort() {
      this.users.sort(this.compareNames);
      this.sortType *= -1;
    },
    compareNames(u1, u2) {
      if (u1.name > u2.name) return 1 * this.sortType;
      else if (u1.name < u2.name) return -1 * this.sortType;
      else return 0;
    },
    getTypeLabel(type) {
      const typeMap = {
        admin: "Administrador",
        user: "Utilizador",
        sponsor: "Sponsor",
        expert: "Expert"
      };
      return typeMap[type] || type;
    },

    viewUser(id) {
      const user = this.users.find(user => user._id === id);
      this.$fire({
        title: user.name,
        html: this.generateTemplate(user)
      });
    },

    generateTemplate(user) {
      return `
          <p>
          <b>Nome:</b> ${user.name} <br>
          <b>Tipo de utilizador:</b> ${this.getTypeLabel(user.type)} <br>
          <b>Observações:</b> ${user.description || "Sem observações"} <br>
          <b>Data de nascimento:</b> ${this.formatDate(user.birth_date)}<br>
          <b>Cidade:</b> ${user.location.city || "N/A"}<br>
          <b>País:</b> ${user.location.country || "N/A"}
          </p>
        `;
    },
    formatDate(d) {
      if (!d) return "N/A";
      const newDate = new Date(d);
      if (isNaN(newDate.getTime())) return "Data inválida";
      return (
        newDate.getFullYear() +
        "-" +
        (newDate.getMonth() + 1) +
        "-" +
        newDate.getDate() +
        " " +
        newDate.getHours() +
        ":" +
        newDate.getMinutes() +
        ":" +
        newDate.getSeconds()
      );
    },
    removeUser(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover o utilizador?",
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store.dispatch(`sponsor/${REMOVE_SPONSOR}`, id).then(() => {
            this.$alert(this.getMessage, "Utilizador removido!", "success");
            this.fetchUsers();
          });
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    }
  },
  created() {
    this.fetchUsers();
  }
};
</script>
