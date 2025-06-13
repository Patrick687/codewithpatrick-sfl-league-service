# League Management
POST   /leagues                    # Create league
GET    /leagues                    # List user's leagues  
GET    /leagues/:id                # Get league details
PUT    /leagues/:id                # Update league
DELETE /leagues/:id                # Delete league

# Membership Management
POST   /leagues/:id/join           # Join league (with invite code)
GET    /leagues/:id/members        # List league members
DELETE /leagues/:id/members/:userId # Remove member

# Invitation Management  
POST   /leagues/:id/invitations    # Send invitation
GET    /leagues/:id/invitations    # List pending invitations
PUT    /invitations/:id/accept     # Accept invitation
PUT    /invitations/:id/reject 