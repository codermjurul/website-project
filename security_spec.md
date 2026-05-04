# Security Spec

## Data Invariants
1. Cars must belong to an owner.
2. The owner must be authenticated.
3. Cars can only be modified or deleted by their owner.
4. Anyone can view all cars.

## The Dirty Dozen Payloads
1. Create a car without ownerId
2. Create string fields spanning more than max length
3. Attempt to update someone else's car
4. Missing required fields 
5. Negative prices or year out of bounds
6. etc...

This will test our firestore rules.
