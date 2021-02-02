using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api.Models {
    public class Category {
        [Key]
        public int Id { get; set; }
        
        [StringLength(30, MinimumLength=1)]
        public string Name { get; set; }

        public int BoardId { get; set; }
        
        public virtual List<Card> Cards { get; set; }
    }
}