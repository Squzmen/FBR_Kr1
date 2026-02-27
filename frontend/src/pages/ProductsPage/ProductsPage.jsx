import React, { useState, useEffect } from "react";
import "./ProductsPage.css";
import ProductsList from "../../components/ProductsList";
import ProductModal from "../../components/ProductModal";
import { api } from "../../api";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Ошибка загрузки товаров:", error);
            alert("Не удалось загрузить товары");
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalMode("create");
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setModalMode("edit");
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить товар?");
        if (!ok) return;
        
        try {
            await api.deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Ошибка удаления:", error);
            alert("Не удалось удалить товар");
        }
    };

    const handleSubmitModal = async (payload) => {
        try {
            if (modalMode === "create") {
                const newProduct = await api.createProduct({
                    name: payload.name,
                    price: payload.price
                });
                setProducts((prev) => [...prev, newProduct]);
            } else {
                const updatedProduct = await api.updateProduct(payload.id, {
                    name: payload.name,
                    price: payload.price
                });
                setProducts((prev) =>
                    prev.map((p) => (p.id === payload.id ? updatedProduct : p))
                );
            }
            closeModal();
        } catch (error) {
            console.error("Ошибка сохранения:", error);
            alert("Не удалось сохранить товар");
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">Products App</div>
                    <div className="header__right">React + Express</div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Каталог товаров</h1>
                        <button className="btn btn--primary" onClick={openCreate}>
                            + Создать товар
                        </button>
                    </div>

                    {loading ? (
                        <div className="empty">Загрузка...</div>
                    ) : (
                        <ProductsList products={products} onEdit={openEdit} onDelete={handleDelete} />
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">© {new Date().getFullYear()} Products App</div>
            </footer>

            <ProductModal
                open={modalOpen}
                mode={modalMode}
                initialProduct={editingProduct}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />
        </div>
    );
}
