import React, { useState, useEffect } from "react";
import "./UsersPage.css";
import UsersList from "../../components/UsersList";
import UserModal from "../../components/UserModal";
import { api } from "../../api";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Ошибка загрузки пользователей:", error);
            alert("Не удалось загрузить пользователей");
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalMode("create");
        setEditingUser(null);
        setModalOpen(true);
    };

    const openEdit = (user) => {
        setModalMode("edit");
        setEditingUser(user);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingUser(null);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить пользователя?");
        if (!ok) return;

        try {
            await api.deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            console.error("Ошибка удаления:", error);
            alert("Не удалось удалить пользователя");
        }
    };

    const handleSubmitModal = async (payload) => {
        try {
            if (modalMode === "create") {
                const newUser = await api.createUser({
                    name: payload.name,
                    age: payload.age
                });
                setUsers((prev) => [...prev, newUser]);
            } else {
                const updatedUser = await api.updateUser(payload.id, {
                    name: payload.name,
                    age: payload.age
                });
                setUsers((prev) =>
                    prev.map((u) => (u.id === payload.id ? updatedUser : u))
                );
            }
            closeModal();
        } catch (error) {
            console.error("Ошибка сохранения:", error);
            alert("Не удалось сохранить пользователя");
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">Users App</div>
                    <div className="header__right">React + Express</div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Список пользователей</h1>
                        <button className="btn btn--primary" onClick={openCreate}>
                            + Создать пользователя
                        </button>
                    </div>

                    {loading ? (
                        <div className="empty">Загрузка...</div>
                    ) : (
                        <UsersList users={users} onEdit={openEdit} onDelete={handleDelete} />
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">© {new Date().getFullYear()} Users App</div>
            </footer>

            <UserModal
                open={modalOpen}
                mode={modalMode}
                initialUser={editingUser}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />
        </div>
    );
}
