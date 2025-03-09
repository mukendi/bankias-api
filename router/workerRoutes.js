const express = require("express");
const pool = require("../config/db");
const Worker = require("../model/workerModel");
const upload = require("../middleware/uploadMiddleware");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const fs = require('fs');
const path = require('path');

const router = express.Router();

//  Protéger les routes avec authenticate et isAdmin

// Récupérer tous les workers (nécessite authentification)
router.get("/", authenticate, async (req, res) => {
  try {
    const workers = await Worker.getAll();
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur : " + error });
  }
});

// Récupèrer le worker en fonction de son ID

router.get("/:id", authenticate, async (req, res) => {
    const id = req.params.id
    try {
      const worker = await Worker.getById(id);
      res.json(worker);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur : " + error });
    }
  });

// Créer un worker (réservé aux ADMIN)
router.post("/", authenticate, isAdmin, upload.single("photo_profile"), async (req, res) => {
  try {
    const { nom, prenom, postnom,email, sexe, phone, categorie } = req.body;
    const photo_profile = req.file ? req.file.filename : null;

    const newWorker = await Worker.create(nom, prenom, postnom,email, sexe, phone, categorie, photo_profile);
    res.status(201).json(newWorker);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur : " + error });
  }
});

// Modifier un worker (ADMIN uniquement)
router.put("/:id", authenticate, isAdmin, upload.single("photo_profile"), async (req, res) => {
  
  try {
    const { id } = req.params;
    const { nom, prenom, postnom,email, sexe, phone, categorie } = req.body;
  
    // Vérification du Worker
  
    let worker = await Worker.getById(id);
    if (!worker) {
      return res.status(404).json({ message : "Worker non trouvé"});
    }
  
    // vérifier si la nouvelle photo a été envoyée
  
    let newPhoto = req.file ? req.file.filename : worker.photo_profile;
  
    if (req.file && worker.photo_profile) {
      // Supprimer l'ancienne photo si elle existe
      const oldPhotoPath = path.join(__dirname, "../uploads", worker.photo_profile);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath); //  Supprimer l'ancienne image
      }
    }
  
        // Mettre à jour le Worker avec les nouvelles données
        //worker.nom = nom;
        //worker.prenom = prenom;
        //worker.postnom = postnom;
        //worker.email = email;
        //worker.sexe = sexe;
        //worker.phone = phone;
        //worker.categorie = categorie;
        //worker.photo_profile = newPhoto;
        console.log(newPhoto)
        await Worker.update(id, nom, postnom, prenom, email,sexe, phone, categorie, newPhoto);

  
        res.json({ message: "Worker mis à jour avec succès", worker });
  
  }catch(error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
  
  /*
  try {
    const { nom, prenom, postnom, sexe, phone, categorie } = req.body;
    const photo_profile = req.file ? req.file.filename : null;

    const updatedWorker = await Worker.update(req.params.id, nom, prenom, postnom, sexe, phone, categorie, photo_profile);
    res.json(updatedWorker);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
    */
});

// Supprimer un worker (ADMIN uniquement)
router.delete("/:id", authenticate, isAdmin, async (req, res) => {
    const { id } = req.params;
    
    try {
        //  Récupérer l'URL de la photo de profil
        const result = await pool.query('SELECT photo_profile FROM workers WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Worker non trouvé" });
        }

        const photoPath = result.rows[0].photo_profile;
        
        
        //  Supprimer l'utilisateur de la base de données
        await pool.query('DELETE FROM workers WHERE id = $1', [id]);

        //  Supprimer le fichier image si existant
        if (photoPath) {
            const filePath = path.join(__dirname, '..', 'uploads', path.basename(photoPath));
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Erreur lors de la suppression du fichier :", err);
                } else {
                    console.log(`Image supprimée : ${filePath}`);
                }
            });
        }

        return res.status(200).json({ message: "Worker et photo supprimés avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du worker :", error);
        return res.status(500).json({ message: "Erreur serveur : " + error });
    }
  
  
    /*
    try {
    await Worker.delete(req.params.id);
    res.json({ message: "Worker supprimé avec succès" });
    } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    }
    */
    
});

module.exports = router;
