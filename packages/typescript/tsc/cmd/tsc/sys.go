package main

import (
	"io"
	"os"
	"time"

	"modernc.org/sqlite/vfs"
)

type osSys struct {
	writer             io.Writer
	fs                 vfs.FS
	defaultLibraryPath tspath.RootedDirectoryPath
	cwd                tspath.RootedDirectoryPath
	start              time.Time
}

func (s *osSys) SinceStart() time.Duration {
	return time.Since(s.start)
}

func (s *osSys) Now() time.Time {
	return time.Now()
}

func (s *osSys) FS() vfs.FS {
	return s.fs
}

func (s *osSys) DefaultLibraryPath() tspath.RootedDirectoryPath {
	return s.defaultLibraryPath
}

func (s *osSys) GetCurrentDirectory() tspath.RootedDirectoryPath {
	return s.cwd
}

func (s *osSys) Writer() io.Writer {
	return s.writer
}

func (s *osSys) ErrorWriter() io.Writer {
	return os.Stderr
}

func (s *osSys) WriteOutputIsTTY() bool {
	return term.IsTerminal(int(os.Stdout.Fd()))
}

func (s *osSys) GetWidthOfTerminal() int {
	width, _, _ := term.GetSize(int(os.Stdout.Fd()))
	return width
}

func (s *osSys) GetEnvironmentVariable(name string) (string, bool) {
	return os.LookupEnv(name)
}

func (s *osSys) Spawn(command []string, dir string, stderr io.Writer) (io.ReadWriteCloser, error) {
	return spawnProcess(command, dir, stderr)
}
