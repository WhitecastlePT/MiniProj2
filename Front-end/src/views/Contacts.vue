<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Contactos" />

      <!--FORM-->
      <form @submit.prevent="send">
        <b-row>
          <b-col cols="2"></b-col>
          <b-col cols="8">
            <div class="form-group">
              <input
                v-model="name"
                type="text"
                class="form-control form-control-lg"
                id="txtName"
                placeholder="escreve o teu nome"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="email"
                type="email"
                class="form-control form-control-lg"
                id="txtEmail"
                placeholder="escreve o teu e-mail"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="subject"
                type="text"
                class="form-control form-control-lg"
                id="txtSubject"
                placeholder="escreve o assunto"
                required
              />
            </div>
            <div class="form-group">
              <textarea
                id="txtDescription"
                class="form-control form-control-lg"
                placeholder="escreve a tua mensagem"
                cols="30"
                rows="10"
                v-model="message"
                required
              ></textarea>
            </div>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <b-button type="submit" variant="success" class="p-2 mr-2">
              <i class="fas fa-envelope-square mr-2"></i>ENVIAR
            </b-button>
            <b-button type="reset" variant="danger" class="p-2">
              <i class="fas fa-eraser mr-2"></i>LIMPAR
            </b-button>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
      </form>
    </b-container>
  </section>
</template>

<script>
import HeaderPage from "@/components/HeaderPage.vue";
import { SEND_EMAIL } from "@/store/constants";
import { mapGetters } from "vuex";

export default {
  name: "Contacts",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      name: "",
      email: "",
      subject: "",
      message: ""
    };
  },
  computed: {
    ...mapGetters(["getMessage"])
  },
  methods: {
    send() {
      this.$store.dispatch(`${SEND_EMAIL}`, this.$data).then(
        () => {
          this.$alert(this.getMessage, "E-mail enviado!", "success");
          // Limpar formulário após envio
          this.name = "";
          this.email = "";
          this.subject = "";
          this.message = "";
        },
        err => this.$alert(`${err.message}`, "Erro", "error")
      );
    }
  }
};
</script>
