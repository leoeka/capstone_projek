from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class InferenceEngine:
    def predict(self, cv_text, jobs_db):
        # Ambil deskripsi dari semua lowongan
        job_descriptions = [j["desc"] for j in jobs_db]
        
        # Gabungkan CV + Semua Deskripsi Kerja untuk dihitung vektornya
        all_texts = [cv_text] + job_descriptions
        
        # Konversi teks ke angka (Vectorizing)
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        # Hitung kemiripan antara CV (index 0) dan semua lowongan (index 1 ke atas)
        cv_vector = tfidf_matrix[0:1]
        job_vectors = tfidf_matrix[1:]
        cosine_sim = cosine_similarity(cv_vector, job_vectors).flatten()
        
        # Format hasil
        results = []
        for i, score in enumerate(cosine_sim):
            results.append({
                "job_title": jobs_db[i]["title"],
                "score": round(float(score) * 100, 2)
            })
            
        # Urutkan dari skor tertinggi
        return sorted(results, key=lambda x: x['score'], reverse=True)

ai_engine = InferenceEngine()
