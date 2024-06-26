import express from 'express';
import {addTrip, deleteTrip, getAllTrips, getOneTrip, getUserTrips, rateTrip, updateTrip} from '../../controllers/trip.controller.js';
import {isAdminOrUserAuth} from '../../auth/user-auth/isAdminOrUser.js';
import { isUserRole } from '../../auth/user-auth/isUserRole.js';
import { tripAuth } from '../../auth/trip-auth/tripAuth.js';
import { supaAuth } from '../../auth/supaAuth.js'



export const tripRouter = express.Router();


tripRouter.get('/', supaAuth, isUserRole, getAllTrips);

tripRouter.get('/user-trip/:trip_id',  getOneTrip);

tripRouter.get('/user-trips/:user_id', supaAuth, tripAuth, getUserTrips)

tripRouter.post('/add', addTrip)

tripRouter.put('/:trip_id', updateTrip)

tripRouter.put('/rate-trip/:trip_id', supaAuth, tripAuth, rateTrip)

tripRouter.delete('/:trip_id', supaAuth, isUserRole, deleteTrip)

