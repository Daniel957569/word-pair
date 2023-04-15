use serde::Serialize;
use std::env;
use std::fs;
use std::process::Command;

#[derive(Debug, Serialize)]
pub struct Words {
    pub dutch: Vec<Word>,
    pub english: Vec<Word>,
}

#[derive(Debug, Serialize)]
pub struct Word {
    pub word: String,
    pub id: i32,
}

impl Words {
    pub fn get_words(path: &str) -> Self {
        let file = fs::read_to_string(path).unwrap();
        let mut id = 0;

        let (first_words, second_words): (Vec<Word>, Vec<Word>) = file
            .lines()
            .map(|line| {
                line.split('-')
                    .map(|s| s.trim().to_string())
                    .collect::<Vec<String>>()
            })
            .fold(
                (Vec::new(), Vec::new()),
                |(mut first_words, mut second_words), words| {
                    id += 1;
                    first_words.push(Word {
                        word: words[0].clone().replace(" ", "-"),
                        id,
                    });
                    second_words.push(Word {
                        word: words[1].clone(),
                        id,
                    });
                    (first_words, second_words)
                },
            );

        Words {
            dutch: first_words,
            english: second_words,
        }
    }

    pub fn generate_sounds(words: &Vec<Word>) -> String {
        let mut num = 0;
        let commands = words
            .iter()
            .map(|sentence| {
                num += 1;
                format!(
                    "mimic3 --voice nl/flemishguy_low '{}' > /home/daniel/test/js/my-app/public/sounds/{}.mp3",
                    sentence.word,  sentence.word
                )
            })
            .collect::<Vec<String>>();

        let command = format!("{} ", commands.join(" && "));
        let output = Command::new("sh")
            .arg("-c")
            .arg(&command)
            // .current_dir(&mimic3_path)
            .output()
            .expect("Failed to execute command");

        match output.status.success() {
            true => "sounds were made successfuly.".to_string(),
            false => "generate sounds has failed.".to_string(),
        }
    }
}
