// ─────────────────────────────────────────────────────────────────────────────
// src/context/GymDataContext.js
// Central data store for all gym entities with Admin CRUD operations
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  BRANCHES,
  CLASSES,
  DEALS,
  WORKOUT_PLANS,
  DIET_PLANS,
  BOOKINGS,
  ENQUIRIES,
} from '../constants/mockData';

const GymDataContext = createContext(null);

// Helper: generate simple unique id
const uid = () => Math.random().toString(36).substring(2, 9);

export function GymDataProvider({ children }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [branches, setBranches] = useState(BRANCHES);
  const [classes, setClasses] = useState(CLASSES);
  const [deals, setDeals] = useState(DEALS);
  const [workoutPlans, setWorkoutPlans] = useState(WORKOUT_PLANS);
  const [dietPlans, setDietPlans] = useState(DIET_PLANS);
  const [bookings, setBookings] = useState(BOOKINGS);
  const [enquiries, setEnquiries] = useState(ENQUIRIES);

  // ── BRANCHES ───────────────────────────────────────────────────────────────
  const addBranch = useCallback((data) => {
    setBranches((prev) => [...prev, { id: uid(), ...data }]);
  }, []);

  const updateBranch = useCallback((id, data) => {
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
  }, []);

  const deleteBranch = useCallback((id) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // ── CLASSES ────────────────────────────────────────────────────────────────
  const addClass = useCallback((data) => {
    setClasses((prev) => [...prev, { id: uid(), bookedSlots: 0, ...data }]);
  }, []);

  const updateClass = useCallback((id, data) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteClass = useCallback((id) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const bookClass = useCallback((targetClass, userId = 'user1') => {
    const classId = typeof targetClass === 'object' ? targetClass.id : targetClass;
    const classObj = classes.find((c) => c.id === classId) || (typeof targetClass === 'object' ? targetClass : null);

    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId && c.bookedSlots < c.slots
          ? { ...c, bookedSlots: c.bookedSlots + 1 }
          : c
      )
    );

    const branchObj = branches.find((b) => b.id === classObj?.branchId);

    const newBooking = {
      id: uid(),
      userId,
      classId,
      className: classObj?.name || 'Gym Class',
      trainer: classObj?.trainer || 'Coach',
      branchId: classObj?.branchId || 'b1',
      branchName: branchObj?.name || 'Nandanam',
      date: new Date().toISOString().split('T')[0],
      time: classObj?.time || '6:00 AM',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  }, [classes, branches]);

  const cancelBooking = useCallback((bookingId) => {
    setBookings((prev) => {
      const target = prev.find((b) => b.id === bookingId);
      if (target?.classId) {
        setClasses((cls) =>
          cls.map((c) =>
            c.id === target.classId && c.bookedSlots > 0
              ? { ...c, bookedSlots: c.bookedSlots - 1 }
              : c
          )
        );
      }
      return prev.filter((b) => b.id !== bookingId);
    });
  }, []);

  // ── DEALS ──────────────────────────────────────────────────────────────────
  const addDeal = useCallback((data) => {
    setDeals((prev) => [...prev, { id: uid(), isActive: true, ...data }]);
  }, []);

  const updateDeal = useCallback((id, data) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
  }, []);

  const deleteDeal = useCallback((id) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // ── WORKOUT PLANS ──────────────────────────────────────────────────────────
  const addPlan = useCallback((data) => {
    setWorkoutPlans((prev) => [...prev, { id: uid(), ...data }]);
  }, []);

  const updatePlan = useCallback((id, data) => {
    setWorkoutPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const deletePlan = useCallback((id) => {
    setWorkoutPlans((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── DIET PLANS ─────────────────────────────────────────────────────────────
  const addDietPlan = useCallback((data) => {
    setDietPlans((prev) => [...prev, { id: uid(), ...data }]);
  }, []);

  const updateDietPlan = useCallback((id, data) => {
    setDietPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const deleteDietPlan = useCallback((id) => {
    setDietPlans((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── ENQUIRIES ──────────────────────────────────────────────────────────────
  const addEnquiry = useCallback((data) => {
    setEnquiries((prev) => [
      { id: uid(), status: 'New', createdAt: new Date().toISOString(), ...data },
      ...prev,
    ]);
  }, []);

  const updateEnquiryStatus = useCallback((id, status) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }, []);

  return (
    <GymDataContext.Provider
      value={{
        // Data
        branches, classes, deals, workoutPlans, dietPlans, bookings, enquiries,
        // Branch ops
        addBranch, updateBranch, deleteBranch,
        // Class ops
        addClass, updateClass, deleteClass, bookClass, cancelBooking,
        // Deal ops
        addDeal, updateDeal, deleteDeal,
        // Workout plan ops
        addPlan, updatePlan, deletePlan,
        // Diet plan ops
        addDietPlan, updateDietPlan, deleteDietPlan,
        // Enquiry ops
        addEnquiry, updateEnquiryStatus,
      }}
    >
      {children}
    </GymDataContext.Provider>
  );
}

export function useGymData() {
  const ctx = useContext(GymDataContext);
  if (!ctx) throw new Error('useGymData must be used within GymDataProvider');
  return ctx;
}
