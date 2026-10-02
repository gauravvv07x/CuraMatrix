/* =====================================================
   CURAMATRIX USERS
   ===================================================== */

const API_URL =
    "https://curamatrix-backend.onrender.com/api/users";


/* =====================================================
   VARIABLES
   ===================================================== */

let users = [];

let editingUserId = null;


/* =====================================================
   ELEMENTS
   ===================================================== */

const userModal =
    document.getElementById("userModal");

const userForm =
    document.getElementById("userForm");

const addUserBtn =
    document.getElementById("addUserBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const togglePassword =
    document.getElementById("togglePassword");

const userPassword =
    document.getElementById("userPassword");

const searchInput =
    document.getElementById("searchInput");

const roleFilter =
    document.getElementById("roleFilter");

const userTableBody =
    document.getElementById("userTableBody");

const modalTitle =
    document.getElementById("modalTitle");

const saveUserBtn =
    document.getElementById("saveUserBtn");


/* =====================================================
   ROLE MAPPING
   ===================================================== */

function roleToBackend(role) {

    if (role === "Administrator") {
        return "admin";
    }

    if (role === "Pharmacist") {
        return "pharmacist";
    }

    return "staff";
}


function roleToDisplay(role) {

    if (role === "admin") {
        return "Administrator";
    }

    if (role === "pharmacist") {
        return "Pharmacist";
    }

    return "Staff";
}


/* =====================================================
   LOAD USERS
   ===================================================== */

async function loadUsers() {

    try {

        userTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row">
                    Loading users...
                </td>
            </tr>
        `;


        const response =
            await fetch(API_URL);


        const data =
            await response.json();


        console.log("Users API:", data);


        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Unable to load users"
            );

        }


        users =
            data.users || data.data || [];


        updateSummary();

        renderUsers();


    } catch (error) {

        console.error("Users error:", error);

        userTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row">
                    Unable to load users from database.
                </td>
            </tr>
        `;

    }

}


/* =====================================================
   SUMMARY
   ===================================================== */

function updateSummary() {

    const total =
        users.length;


    const admins =
        users.filter(
            user => user.role === "admin"
        ).length;


    const pharmacists =
        users.filter(
            user => user.role === "pharmacist"
        ).length;


    const staff =
        users.filter(
            user => user.role === "staff"
        ).length;


    document.getElementById("totalUsers").textContent =
        total;

    document.getElementById("adminUsers").textContent =
        admins;

    document.getElementById("pharmacistUsers").textContent =
        pharmacists;

    document.getElementById("staffUsers").textContent =
        staff;

}


/* =====================================================
   RENDER USERS
   ===================================================== */

function renderUsers() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedRole =
        roleFilter.value;


    const filteredUsers =
        users.filter(user => {

            const displayRole =
                roleToDisplay(user.role);


            const matchesSearch =
                (user.username || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (user.fullName || "")
                    .toLowerCase()
                    .includes(search)

                ||

                displayRole
                    .toLowerCase()
                    .includes(search);


            const matchesRole =
                selectedRole === "all"
                ||
                displayRole === selectedRole;


            return matchesSearch && matchesRole;

        });


    if (filteredUsers.length === 0) {

        userTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row">
                    No users found.
                </td>
            </tr>
        `;

        return;
    }


    userTableBody.innerHTML =
        filteredUsers.map(
            (user, index) => {

                const displayRole =
                    roleToDisplay(user.role);


                const status =
                    user.isActive === false
                        ? "Inactive"
                        : "Active";


                let roleClass =
                    "role-staff";


                if (user.role === "admin") {
                    roleClass = "role-admin";
                }

                if (user.role === "pharmacist") {
                    roleClass = "role-pharmacist";
                }


                const statusClass =
                    status === "Active"
                        ? "status-active"
                        : "status-inactive";


                return `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            <strong>
                                ${escapeHtml(user.username || "")}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(user.fullName || "-")}
                        </td>

                        <td>

                            <span class="role-badge ${roleClass}">
                                ${displayRole}
                            </span>

                        </td>

                        <td>

                            <span class="${statusClass}">
                                ${status}
                            </span>

                        </td>

                        <td>

                            <button
                                type="button"
                                class="edit-btn"
                                onclick="editUser('${user._id}')">
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-btn"
                                onclick="deleteUser('${user._id}')">
                                Delete
                            </button>

                        </td>

                    </tr>
                `;

            }
        ).join("");

}


/* =====================================================
   OPEN ADD USER MODAL
   ===================================================== */

function openAddUserModal() {

    editingUserId = null;


    userForm.reset();


    document.getElementById("editUserId").value =
        "";


    document.getElementById("userRole").value =
        "Staff";


    document.getElementById("userStatus").value =
        "Active";


    userPassword.type =
        "password";


    modalTitle.textContent =
        "Add User";


    saveUserBtn.textContent =
        "Add User";


    userModal.classList.add("show");


    setTimeout(() => {

        document
            .getElementById("userUsername")
            .focus();

    }, 100);

}


/* =====================================================
   CLOSE MODAL
   ===================================================== */

function closeModal() {

    userModal.classList.remove("show");

    editingUserId = null;

    userForm.reset();

    userPassword.type =
        "password";

}


/* =====================================================
   EDIT USER
   ===================================================== */

function editUser(id) {

    const user =
        users.find(
            item => item._id === id
        );


    if (!user) {

        alert("User not found.");

        return;
    }


    editingUserId =
        user._id;


    document.getElementById("editUserId").value =
        user._id;


    document.getElementById("userUsername").value =
        user.username || "";


    document.getElementById("userName").value =
        user.fullName || "";


    document.getElementById("userRole").value =
        roleToDisplay(user.role);


    document.getElementById("userStatus").value =
        user.isActive === false
            ? "Inactive"
            : "Active";


    document.getElementById("userPassword").value =
        "";


    document.getElementById("userPassword").required =
        false;


    modalTitle.textContent =
        "Edit User";


    saveUserBtn.textContent =
        "Update User";


    userModal.classList.add("show");

}


/* =====================================================
   SAVE / UPDATE USER
   ===================================================== */

async function saveUser(event) {

    event.preventDefault();


    const username =
        document
            .getElementById("userUsername")
            .value
            .trim();


    const fullName =
        document
            .getElementById("userName")
            .value
            .trim();


    const selectedRole =
        document
            .getElementById("userRole")
            .value;


    const selectedStatus =
        document
            .getElementById("userStatus")
            .value;


    const password =
        document
            .getElementById("userPassword")
            .value;


    if (!username || !fullName) {

        alert("Please enter username and full name.");

        return;
    }


    if (!editingUserId && !password) {

        alert("Please enter password.");

        return;
    }


    const payload = {

        username: username,

        fullName: fullName,

        role: roleToBackend(selectedRole),

        isActive:
            selectedStatus === "Active"

    };


    if (password) {

        payload.password =
            password;

    }


    try {

        saveUserBtn.disabled =
            true;


        saveUserBtn.textContent =
            editingUserId
                ? "Updating..."
                : "Adding...";


        let response;


        if (editingUserId) {

            response =
                await fetch(
                    `${API_URL}/${editingUserId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(payload)
                    }
                );

        } else {

            response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(payload)
                    }
                );

        }


        const data =
            await response.json();


        console.log("Save user response:", data);


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to save user"
            );

        }


        alert(
            editingUserId
                ? "User updated successfully."
                : "User added successfully."
        );


        closeModal();

        await loadUsers();


    } catch (error) {

        console.error("Save user error:", error);

        alert(
            error.message ||
            "Unable to save user."
        );


    } finally {

        saveUserBtn.disabled =
            false;


        saveUserBtn.textContent =
            editingUserId
                ? "Update User"
                : "Add User";

    }

}


/* =====================================================
   DELETE USER
   ===================================================== */

async function deleteUser(id) {

    const user =
        users.find(
            item => item._id === id
        );


    if (!user) {
        return;
    }


    if (user.username === "admin") {

        alert(
            "The main admin user cannot be deleted."
        );

        return;
    }


    const confirmDelete =
        confirm(
            `Delete user "${user.username}"?`
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to delete user"
            );

        }


        alert(
            "User deleted successfully."
        );


        await loadUsers();


    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete user."
        );

    }

}


/* =====================================================
   PASSWORD TOGGLE
   ===================================================== */

function togglePasswordVisibility() {

    if (userPassword.type === "password") {

        userPassword.type =
            "text";

        togglePassword.textContent =
            "🙈";

    } else {

        userPassword.type =
            "password";

        togglePassword.textContent =
            "👁️";

    }

}


/* =====================================================
   HTML ESCAPE
   ===================================================== */

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =====================================================
   EVENTS
   ===================================================== */

addUserBtn.addEventListener(
    "click",
    openAddUserModal
);


closeModalBtn.addEventListener(
    "click",
    closeModal
);


cancelBtn.addEventListener(
    "click",
    closeModal
);


userForm.addEventListener(
    "submit",
    saveUser
);


togglePassword.addEventListener(
    "click",
    togglePasswordVisibility
);


searchInput.addEventListener(
    "input",
    renderUsers
);


roleFilter.addEventListener(
    "change",
    renderUsers
);


/* Close when clicking outside modal */

userModal.addEventListener(
    "click",
    function(event) {

        if (event.target === userModal) {

            closeModal();

        }

    }
);


/* ESC closes modal */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            userModal.classList.contains("show")
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   LOGOUT
   ===================================================== */
document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function() {

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmLogout) {

                window.location.href =
                    "../../login.html";

            }

        }
    );


/* =====================================================
   INITIAL LOAD
   ===================================================== */

loadUsers();