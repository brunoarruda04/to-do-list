const express = require("express");
const router = express.Router();

const Checklist = require("../models/checklist");

// GET
router.get("/", async (req, res) => {
   try {
      let checklists = await Checklist.find({});
      res.status(200).render("checklists/index", { checklists: checklists });
   } catch (error) {
      res.status(404).render("pages/error", { error: "Erro ao exibir as listas" });
   }
});

// NEW
router.get("/new", async (req, res) => {
   try {
      let checklist = new Checklist();
      res.status(200).render("checklists/new", { checklist: checklist });
   } catch (error) {
      res.status(500).render("pages/error", { errors: "Erro ao carregar o formulário" });
   }
});

// EDIT
router.get("/:id/edit", async (req, res) => {
   try {
      let checklist = await Checklist.findById(req.params.id);
      res.status(200).render("checklists/edit", { checklist: checklist });
   } catch (error) {
      res.status(500).render("pages/error", { errors: "Erro ao exibir a edição de lista de tarefas" });
   }
});

// GET BY ID
router.get("/:id", async (req, res) => {
   try {
      let checklist = await Checklist.findById(req.params.id).populate("tasks");
      res.status(200).render("checklists/show", { checklist: checklist });
   } catch (error) {
      res.status(500).render("pages/error", { error: "Erro ao exibir as listas de tarefas" });
   }
});

// POST
router.post("/", async (req, res) => {
   let { name } = req.body.checklist;
   let checklist = new Checklist({ name });

   try {
      await checklist.save();
      res.redirect("/checklists");
   } catch (error) {
      res.status(422).render("checklists/new", { checklists: { ...checklist, error } });
   }
});

// PUT
router.put("/:id", async (req, res) => {
   let { name } = req.body.checklist;
   let checklist = await Checklist.findById(req.params.id);

   try {
      await checklist.update({ name });
      res.redirect("/checklists");
   } catch (error) {
      let errors = error.errors;
      res.status(422).render("checklist/edit", { checklist: { ...checklist, errors } });
   }
});

// DELETE
router.delete("/:id", async (req, res) => {
   try {
      let checklist = await Checklist.findByIdAndRemove(req.params.id);
      res.redirect("/checklists");
   } catch (error) {
      res.status(500).render("pages/error", { error: "Erro ao deletar as listas de tarefas" });
   }
});

module.exports = router;
