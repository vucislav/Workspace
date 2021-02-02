using Microsoft.EntityFrameworkCore;

namespace api.Models {
    public class WorkspaceContext : DbContext {
        
        public DbSet<Board> Boards { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Card> Cards { get; set; }

        public WorkspaceContext(DbContextOptions options) : base(options) {

        }
    }
}