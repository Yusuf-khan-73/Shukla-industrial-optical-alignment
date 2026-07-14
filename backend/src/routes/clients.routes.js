const express = require('express');
const { authenticate } = require('../middleware/auth');
const clientsController = require('../controllers/clientsController');

const router = express.Router();

router.get('/clients', clientsController.listClients);

router.get('/admin/clients', authenticate, clientsController.adminListClients);
router.post('/admin/clients', authenticate, clientsController.createClient);
router.put('/admin/clients/:item_id', authenticate, clientsController.updateClient);
router.delete('/admin/clients/:item_id', authenticate, clientsController.deleteClient);

module.exports = router;
