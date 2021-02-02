using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models {
    public class Board {
        [Key]
        public int Id { get; set; }
        
        [StringLength(50, MinimumLength=1)]
        public string Name { get; set; }

        public string Description { get; set; }

        public virtual List<Category> Categories { get; set; }
    }
}