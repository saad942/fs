const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

// Assurez-vous que le répertoire de destination pour les fichiers téléchargés existe
const uploadDestination = "./public/images";
fs.mkdir(uploadDestination, { recursive: true }).catch(console.error);

const dbConfig = {
    host: 'mysql', // Mettez à jour pour correspondre au nom du service MySQL dans Docker Compose
    user: 'root',
    password: 'password',
    database: 'microservice',
    connectionLimit: 10,
};

// Utilisez createPool au lieu de createConnection pour gérer efficacement les connexions
let pool = mysql.createPool(dbConfig);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDestination);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

app.post('/create', upload.single('file'), async (req, res) => {
    try {
        // Validez les champs du formulaire
        if (!req.body.sujet || !req.body.description || !req.file) {
            return res.status(400).json({ Status: 'Error', Error: 'Veuillez remplir tous les champs' });
        }

        const sql = "INSERT INTO save (`sujet`, `description`, `fichier`) VALUES (?, ?, ?)";
        const filePath = `${uploadDestination}/${Date.now()}_${req.file.originalname}`;

        // Lisez le fichier de manière asynchrone
        const fileContent = await fs.readFile(req.file.path);

        const values = [
            req.body.sujet,
            req.body.description,
            fileContent
        ];

        // Utilisez la méthode query de pool pour exécuter la requête SQL
        pool.query(sql, values, (err, result) => {
            if (err) {
                console.error("Erreur lors de l'insertion des données:", err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ Status: "Error", Error: "Entrée en double" });
                } else {
                    return res.status(500).json({ Status: "Error", Error: "Erreur lors de l'insertion des données" });
                }
            }

            // Vérifiez si le résultat est défini avant d'accéder aux propriétés
            if (result && result.affectedRows > 0) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Erreur lors de la suppression du fichier:", unlinkErr);
                    }
                }); // Supprimez le fichier téléchargé après l'insertion réussie

                return res.json({ Status: "Success" });
            } else {
                return res.status(500).json({ Status: "Error", Error: "Erreur lors de l'insertion des données" });
            }
        });
    } catch (uploadError) {
        console.error("Erreur lors du traitement du téléchargement:", uploadError);
        return res.status(500).json({ Status: "Error", Error: "Erreur lors du traitement du téléchargement" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Le serveur écoute sur le port ${PORT}`);
});
